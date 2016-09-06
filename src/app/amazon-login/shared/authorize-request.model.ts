export class AuthorizeRequest {
    access_token: string;
    code: string;
    error: string;
    error_description: string;
    error_uri: string;
    expires_in: number;
    scope: string;
    state: string;
    status: string;
    token_type: string;
    onComplete(next: URL | (AuthorizeRequest)) {};
}
