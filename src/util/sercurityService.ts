import localStore from "@util/localStore";

class SecurityService {
  static isLogged = () => {
    const accessToken = localStore.getJson("accessToken");
    return !!accessToken;
  };

  static getUser = () => {
    if (SecurityService.isLogged()) {
      return localStore.getJson("userInfo");
    }
  };
}

export default SecurityService;
