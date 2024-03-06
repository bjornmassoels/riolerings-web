export class Token {
  public access_token: string
  public expires_in: number
  public refresh_token: string
  public token_type: string
  constructor(
    access_token: string,
    expires_in: number,
    refresh_token: string,
    token_type: string
  ) {
    this.access_token = access_token
    this.expires_in = expires_in
    this.refresh_token = refresh_token
    this.token_type = token_type
  }
}
