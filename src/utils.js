export function createPageUrl(pageName) {
  switch (pageName) {
    case "Home":
      return "/";
    case "Contact":
      return "/contact";
    case "ImageEnhancement":
      return "/image-enhancement";
    default:
      return "/";
  }
}
