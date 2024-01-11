import { WxLoginProps } from "@/interfaces";

export const WxLogin = (props: WxLoginProps) => {
  const src = `https://open.weixin.qq.com/connect/qrconnect?appid=${
    props.appid
  }&scope=${props.scope || "snsapi_login"}&redirect_uri=${encodeURIComponent(
    props.redirect_uri
  )}&state=${props.state || ""}&login_type=jssdk&self_redirect=${
    props.self_redirect || false
  }&style=${props.theme || "black"}&href=${
    props.href || window.location.origin + "/wxlogin-style.css"
  }`;

  return (
    <div className="flex justify-center items-center">
      <iframe
        className="w-[320px] h-[320px] border-0"
        src={src}
        style={{ overflow: "hidden" }}
      ></iframe>
    </div>
  );
};
