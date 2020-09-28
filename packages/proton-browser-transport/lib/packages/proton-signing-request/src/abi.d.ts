export declare type AccountName = string;
export declare type ActionName = string;
export declare type PermissionName = string;
export declare type ChainAlias = number;
export declare type ChainId = string;
export declare type VariantId = ['chain_alias', ChainAlias] | ['chain_id', ChainId];
export declare type VariantReq = ['action', Action] | ['action[]', Action[]] | ['transaction', Transaction] | ['identity', Identity];
export interface PermissionLevel {
    actor: AccountName;
    permission: PermissionName;
}
export declare type RequestFlags = number;
export declare const RequestFlagsNone = 0;
export declare const RequestFlagsBroadcast: number;
export declare const RequestFlagsBackground: number;
export interface Action {
    account: AccountName;
    name: ActionName;
    authorization: PermissionLevel[];
    data: string | {
        [key: string]: any;
    };
}
export interface Extension {
    type: number;
    data: string;
}
export interface TransactionHeader {
    expiration: string;
    ref_block_num: number;
    ref_block_prefix: number;
    max_net_usage_words: number;
    max_cpu_usage_ms: number;
    delay_sec: number;
}
export interface Transaction extends TransactionHeader {
    context_free_actions: Action[];
    actions: Action[];
    transaction_extensions: Extension[];
}
export interface SigningRequest {
    chain_id: VariantId;
    req: VariantReq;
    flags: RequestFlags;
    callback: string;
    info: InfoPair[];
}
export interface InfoPair {
    key: string;
    value: Uint8Array | string;
}
export interface Identity {
    permission: PermissionLevel | undefined | null;
}
export interface RequestSignature {
    signer: AccountName;
    signature: string;
}
export declare const data: {
    version: string;
    types: {
        new_type_name: string;
        type: string;
    }[];
    structs: ({
        name: string;
        fields: {
            name: string;
            type: string;
        }[];
        base?: undefined;
    } | {
        name: string;
        base: string;
        fields: {
            name: string;
            type: string;
        }[];
    })[];
    variants: {
        name: string;
        types: string[];
    }[];
    actions: {
        name: string;
        type: string;
    }[];
};
//# sourceMappingURL=abi.d.ts.map