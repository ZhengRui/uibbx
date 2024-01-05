import { Logo } from "./Header";

const Footer = () => (
  <div className="bg-[#01102d] w-full">
    <div className="max-w-screen-2xl mx-auto px-8 lg:px-12 xl:px-16 pt-32 pb-16">
      <div className="flex flex-col divide-y space-y-10 text-white text-sm">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center xs:space-x-8">
            <span>官方网址: uibbx.com</span>
            <span>联系客服QQ: 1533949286</span>
          </div>
        </div>
        <span className="flex justify-center items-center pt-8">
          本站素材图片均来源于网络用户分享，本站所有资源仅供学习研究与交流，不得用于任何商业用途的范围
          ©2023 本站若侵犯了您的合法权益，请联系站长删除!
        </span>
      </div>
    </div>
  </div>
);

export default Footer;
