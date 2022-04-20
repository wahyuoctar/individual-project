const requiresAuth = (gssp) => {
  return async (context) => {
    const savedUserData = context.req.cookies.user_token;

    if (!savedUserData) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    return gssp(context);
  }
}

export default requiresAuth