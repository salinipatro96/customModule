export const PROXY_TARGET = "https://umb-psb.primo.exlibrisgroup.com";

export default {
  "/": {
    target: PROXY_TARGET,
    secure: false,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
    logLevel: "debug"
  }
};