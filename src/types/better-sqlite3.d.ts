declare module 'better-sqlite3' {
  class Database {
    constructor(filename: string, options?: { readonly?: boolean; fileMustExist?: boolean; timeout?: number; verbose?: Function });
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
    readonly: boolean;
    name: string;
    open: boolean;
    inTransaction: boolean;
  }

  interface Statement {
    run(...params: any[]): { lastInsertRowid: number; changes: number };
    get(...params: any[]): any;
    all(...params: any[]): any[];
    iterate(...params: any[]): IterableIterator<any>;
    pluck(toggleState?: boolean): this;
    expand(toggleState?: boolean): this;
    raw(toggleState?: boolean): this;
    bind(...params: any[]): this;
    columns(): { name: string; type: string }[];
  }

  export = Database;
}
