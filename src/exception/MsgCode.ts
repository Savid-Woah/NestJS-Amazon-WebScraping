export class MsgCode {
  static readonly OOPS_ERROR = new MsgCode(500, 'oops-error');
  static readonly INVALID_CREDENTIALS = new MsgCode(401, 'invalid-credentials');
  static readonly USER_NOT_FOUND = new MsgCode(404, 'user-not-found');
  static readonly PRODUCT_NOT_FOUND = new MsgCode(404, 'product-not-found');
  static readonly WISHLIST_NOT_FOUND = new MsgCode(404, 'wishlist-not-found');
  static readonly PERSISTENCE_EXCEPTION = new MsgCode(
    500,
    'persistence-exception',
  );

  constructor(
    public code: number,
    public languageKey: string,
  ) {}
}