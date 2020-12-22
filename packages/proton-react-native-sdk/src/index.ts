import ReactNativeTransport, { ReactNativeTransportOptions } from './transport';

import ProtonLink, {
  LinkStorage,
  LinkOptions,
  LinkSession,
  PermissionLevel,
} from '@protonprotocol/proton-link';
import { JsonRpc } from '@protonprotocol/protonjs';

import Storage from './storage';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface ConnectWalletArgs {
  linkOptions: PartialBy<LinkOptions, 'transport'> & {
    endpoints?: string | string[];
    rpc?: JsonRpc;
    storage?: LinkStorage;
    storagePrefix?: string;
    restoreSession?: boolean;
  };
  transportOptions: ReactNativeTransportOptions;
}

export const ConnectWallet = async ({
  linkOptions = {},
  transportOptions,
}: ConnectWalletArgs) => {
  // Add RPC if not provided
  if (!linkOptions.rpc && linkOptions.endpoints) {
    linkOptions.rpc = new JsonRpc(linkOptions.endpoints);
  }

  // Add chain ID if not present
  if (!linkOptions.chainId) {
    const info = await linkOptions.rpc!.get_info();
    linkOptions.chainId = info.chain_id;
  }

  // Add storage if not present
  console.log('storage');
  console.log('storage 2');
  if (!linkOptions.storage) {
    linkOptions.storage = new Storage(
      linkOptions.storagePrefix || 'proton-storage'
    );
  }

  // Stop restore session if no saved data
  if (linkOptions.restoreSession) {
    const savedUserAuth = await linkOptions.storage.read('user-auth');
    if (!savedUserAuth) {
      // clean storage to remove unexpected side effects if session restore fails
      linkOptions.storage.remove('user-auth');
      return { link: null, session: null };
    }
  }

  let session, link, loginResult;

  if (
    linkOptions.chainId ===
    '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd'
  ) {
    linkOptions.scheme = 'proton-dev';
  } else {
    linkOptions.scheme = 'proton';
  }

  const transport = new ReactNativeTransport({
    ...transportOptions,
  });

  // Create link
  link = new ProtonLink({
    ...linkOptions,
    transport,
    walletType: 'proton',
  });

  // Get session based on login or restore session
  if (!linkOptions.restoreSession) {
    loginResult = await link.login(transportOptions.requestAccount || '');
    session = loginResult.session;
    linkOptions.storage.write(
      'user-auth',
      JSON.stringify(loginResult.session.auth)
    );
  } else {
    const stringifiedUserAuth = await linkOptions.storage.read('user-auth');
    const parsedUserAuth = stringifiedUserAuth
      ? JSON.parse(stringifiedUserAuth)
      : {};
    const savedUserAuth: PermissionLevel =
      Object.keys(parsedUserAuth).length > 0 ? parsedUserAuth : null;
    if (savedUserAuth) {
      session = await link.restoreSession(
        transportOptions.requestAccount || '',
        savedUserAuth
      );
    }
  }

  return { link, session, loginResult };
};

export { ProtonLink, LinkSession };
