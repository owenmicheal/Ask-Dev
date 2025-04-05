const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  REGISTER_DEVICES: "/register",
  DATA: "/data",
  PROFILE: (id: string) => `/profile/${id}`,
  //   QUESTION: (id: string) => `/question/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
};

export default ROUTES;
