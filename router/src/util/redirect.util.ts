import { Client, HttpClientOptions } from "jayson";

export const redirect = (service: HttpClientOptions) => Client.http(service);

