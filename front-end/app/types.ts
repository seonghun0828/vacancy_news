export type WebSite = {
  name: string;
  url: string;
};

export type WebsiteContent = WebSite & {
  content: string;
};
