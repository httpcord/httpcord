import pony from "fetch-ponyfill";

const Pony = pony();

const isWindowPresent = typeof window !== "undefined";
const isFetchPresent = isWindowPresent && "fetch" in window;

// cross fetch
export const cfetch = isFetchPresent ? window.fetch : Pony.fetch;
export const CRequest = isFetchPresent ? window.Request : Pony.Request;
export const CResponse = isFetchPresent ? window.Response : Pony.Response;
export const CHeaders = isFetchPresent ? window.Headers : Pony.Headers;

export type CRequest = typeof CRequest;
export type CResponse = typeof CResponse;
export type CHeaders = typeof CHeaders;
