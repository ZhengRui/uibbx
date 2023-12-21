import React from "react";

export const WechatIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path
        d="M33.528 43.287C25.533 43.287 19.05 37.887 19.05 31.233C19.05 24.573 25.527 19.173 33.522 19.173C41.517 19.173 48 24.573 48 31.233C48 34.863 46.05 38.136 43.002 40.341C42.8324 40.4614 42.7059 40.6331 42.6411 40.8307C42.5763 41.0283 42.5766 41.2416 42.642 41.439L43.296 43.869C43.3364 43.9829 43.3655 44.1004 43.383 44.22C43.3799 44.3479 43.3278 44.4698 43.2373 44.5603C43.1468 44.6508 43.0249 44.703 42.897 44.706C42.7984 44.7022 42.7028 44.6711 42.621 44.616L39.45 42.786C39.2177 42.6464 38.9529 42.5699 38.682 42.564C38.5377 42.5648 38.3943 42.586 38.256 42.627C36.7189 43.0682 35.1272 43.2904 33.528 43.287ZM27.192 28.626C27.3745 28.9062 27.6263 29.1345 27.923 29.2887C28.2198 29.4429 28.5513 29.5179 28.8855 29.5063C29.2197 29.4948 29.5452 29.397 29.8305 29.2227C30.1159 29.0483 30.3513 28.8031 30.514 28.511C30.6767 28.2189 30.7612 27.8896 30.7593 27.5552C30.7573 27.2209 30.669 26.8926 30.503 26.6024C30.3369 26.3122 30.0986 26.0698 29.8113 25.8987C29.5239 25.7276 29.1973 25.6337 28.863 25.626C28.6081 25.6256 28.3557 25.6756 28.1202 25.773C27.8847 25.8704 27.6707 26.0135 27.4907 26.1938C27.3106 26.3742 27.1679 26.5883 27.0708 26.824C26.9738 27.0596 26.9242 27.3121 26.925 27.567C26.906 27.9392 27.0001 28.3084 27.195 28.626H27.192ZM36.888 28.629C37.0715 28.9091 37.3244 29.1368 37.6221 29.2901C37.9199 29.4433 38.2522 29.5168 38.5868 29.5034C38.9213 29.4899 39.2467 29.3901 39.5312 29.2135C39.8157 29.0368 40.0496 28.7895 40.21 28.4957C40.3705 28.2018 40.4521 27.8713 40.4468 27.5365C40.4416 27.2017 40.3497 26.874 40.18 26.5853C40.0104 26.2966 39.7689 26.0567 39.4791 25.8892C39.1892 25.7216 38.8608 25.6319 38.526 25.629C38.0138 25.6298 37.5229 25.8336 37.1607 26.1958C36.7986 26.5579 36.5948 27.0489 36.594 27.561C36.5826 27.9384 36.685 28.3106 36.888 28.629Z"
        fill="currentColor"
      />
      <path
        d="M0 20.478C0 24.843 2.343 28.773 6.003 31.446C6.20727 31.5896 6.35948 31.7956 6.43682 32.0331C6.51417 32.2705 6.51247 32.5266 6.432 32.763L5.949 34.563L5.649 35.682C5.59692 35.8166 5.56458 35.9581 5.553 36.102C5.5526 36.1781 5.56731 36.2536 5.59626 36.324C5.62522 36.3945 5.66785 36.4585 5.7217 36.5123C5.77554 36.5661 5.83953 36.6088 5.90996 36.6377C5.98038 36.6667 6.05585 36.6814 6.132 36.681C6.249 36.681 6.363 36.651 6.465 36.594L10.269 34.395C10.5487 34.2278 10.8672 34.1368 11.193 34.131C11.367 34.131 11.541 34.158 11.706 34.206C13.2936 34.6615 14.9305 34.9234 16.581 34.986C16.2264 33.7666 16.0476 32.5029 16.05 31.233C16.05 22.425 24.405 16.173 33.522 16.173C33.672 16.173 33.822 16.173 33.972 16.179C31.761 10.287 25.176 6 17.388 6C7.788 6 0 12.48 0 20.478ZM13.896 15.813C13.896 16.4256 13.6526 17.0132 13.2194 17.4464C12.7862 17.8796 12.1987 18.123 11.586 18.123C10.9733 18.123 10.3858 17.8796 9.95258 17.4464C9.51937 17.0132 9.276 16.4256 9.276 15.813C9.276 15.2003 9.51937 14.6128 9.95258 14.1796C10.3858 13.7464 10.9733 13.503 11.586 13.503C12.1987 13.503 12.7862 13.7464 13.2194 14.1796C13.6526 14.6128 13.896 15.2003 13.896 15.813ZM25.521 15.813C25.521 16.4256 25.2776 17.0132 24.8444 17.4464C24.4112 17.8796 23.8237 18.123 23.211 18.123C22.5984 18.123 22.0108 17.8796 21.5776 17.4464C21.1444 17.0132 20.901 16.4256 20.901 15.813C20.901 15.2003 21.1444 14.6128 21.5776 14.1796C22.0108 13.7464 22.5984 13.503 23.211 13.503C23.8237 13.503 24.4112 13.7464 24.8444 14.1796C25.2776 14.6128 25.521 15.2003 25.521 15.813Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const FigmaIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <g clipPath="url(#clip0_3_23)">
        <path
          d="M45.5 129C57.4 129 67 119.4 67 107.5V86H45.5C33.6 86 24 95.6 24 107.5C24 119.4 33.6 129 45.5 129Z"
          fill="#0ACF83"
        />
        <path
          d="M24 64.5C24 52.6 33.6 43 45.5 43H67V86H45.5C33.6 86 24 76.4 24 64.5Z"
          fill="#A259FF"
        />
        <path
          d="M24 21.5C24 9.6 33.6 0 45.5 0H67V43H45.5C33.6 43 24 33.4 24 21.5Z"
          fill="#F24E1E"
        />
        <path
          d="M67 0H88.5C100.4 0 110 9.6 110 21.5C110 33.4 100.4 43 88.5 43H67V0Z"
          fill="#FF7262"
        />
        <path
          d="M110 64.5C110 76.4 100.4 86 88.5 86C76.6 86 67 76.4 67 64.5C67 52.6 76.6 43 88.5 43C100.4 43 110 52.6 110 64.5Z"
          fill="#1ABCFE"
        />
      </g>
      <defs>
        <clipPath id="clip0_3_23">
          <rect width="128" height="128" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const SketchIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 148 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <g clipPath="url(#clip0_4_29)">
        <mask
          id="mask0_4_29"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="148"
          height="128"
        >
          <path d="M147.2 0H0V128H147.2V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_4_29)">
          <path
            d="M73.6 0L32.1166 4.20855L0 45.5763L73.6 127.814L147.2 45.5763L115.084 4.20855L73.6 0Z"
            fill="#FDB300"
          />
          <path
            d="M0 45.5766L73.6 127.813L29.8115 45.5766H0ZM117.388 45.5766L73.6 127.813L147.199 45.5766H117.388Z"
            fill="#EB6C00"
          />
          <path
            d="M29.8125 45.5766L73.6013 127.813L117.389 45.5766H29.8125Z"
            fill="#FDAD00"
          />
          <path
            d="M32.1177 4.20855L29.8125 45.5762L73.6013 0L32.1177 4.20855ZM117.389 45.5768L115.084 4.20855L73.6013 0L117.389 45.5768Z"
            fill="#FDD231"
          />
          <path
            d="M117.389 45.5761H147.199L115.084 4.20782L117.389 45.5761ZM0 45.5761H29.8115L32.1166 4.20782L0 45.5761Z"
            fill="#FDAD00"
          />
          <path
            d="M73.6013 0L29.8125 45.5763H117.389L73.6013 0Z"
            fill="#FEEEB7"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_4_29">
          <rect width="147.2" height="128" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const PhotoShopIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path
        d="M22.667 1.60001H105.333C117.867 1.60001 128 11.733 128 24.267V103.733C128 116.267 117.867 126.4 105.333 126.4H22.667C10.133 126.4 0 116.267 0 103.733V24.267C0 11.733 10.133 1.60001 22.667 1.60001Z"
        fill="#001E36"
      />
      <path
        d="M45.867 33.333C44.267 33.333 42.667 33.333 41.014 33.387C39.36 33.44 37.813 33.44 36.373 33.494C34.933 33.547 33.6 33.547 32.32 33.6C31.093 33.653 30.24 33.653 29.333 33.653C28.96 33.653 28.8 33.866 28.8 34.24V89.12C28.8 89.6 29.013 89.814 29.44 89.814H39.787C40.16 89.76 40.427 89.44 40.373 89.067V71.947C41.386 71.947 42.133 71.947 42.667 72C43.2 72.053 44.053 72.053 45.333 72.053C49.707 72.053 53.707 71.573 57.333 70.24C60.8 68.96 63.787 66.72 65.92 63.733C68.053 60.747 69.12 56.96 69.12 52.373C69.12 49.973 68.694 47.68 67.894 45.44C67.0469 43.1576 65.7189 41.0841 64 39.36C61.9718 37.3896 59.5305 35.8955 56.853 34.986C53.866 33.866 50.24 33.333 45.867 33.333ZM47.057 43.838C48.957 43.874 50.807 44.206 52.533 44.906C54.08 45.493 55.36 46.56 56.267 47.946C57.1187 49.38 57.5443 51.0269 57.494 52.694C57.494 55.04 56.96 56.854 55.84 58.187C54.666 59.52 53.173 60.534 51.467 61.014C49.493 61.654 47.413 61.973 45.333 61.973H42.506C41.866 61.973 41.174 61.92 40.427 61.867V43.947C40.8 43.893 41.547 43.84 42.614 43.894C43.627 43.84 44.853 43.84 46.24 43.84C46.513 43.833 46.786 43.832 47.057 43.838ZM91.787 46.561C88 46.561 84.853 47.147 82.347 48.427C80.054 49.494 78.08 51.2 76.747 53.333C75.574 55.307 74.933 57.493 74.933 59.787C74.8873 61.6738 75.3088 63.5425 76.16 65.227C77.1577 67.0205 78.5426 68.569 80.214 69.76C82.5603 71.3644 85.1062 72.6553 87.787 73.6C90.4 74.613 92.16 75.413 93.014 76.106C93.867 76.8 94.294 77.493 94.294 78.24C94.294 79.2 93.707 80.107 92.854 80.48C91.894 80.96 90.454 81.227 88.427 81.227C86.294 81.227 84.16 80.96 82.133 80.427C79.8058 79.9067 77.5744 79.025 75.52 77.814C75.36 77.707 75.2 77.654 75.04 77.761C74.88 77.867 74.827 78.08 74.827 78.24V87.52C74.774 87.947 75.04 88.32 75.414 88.533C77.1435 89.3411 78.9729 89.9151 80.854 90.24C83.254 90.72 85.653 90.933 88.106 90.933C91.946 90.933 95.147 90.347 97.76 89.227C100.16 88.267 102.24 86.614 103.733 84.48C105.131 82.3818 105.856 79.9077 105.813 77.387C105.865 75.4828 105.444 73.5954 104.587 71.894C103.573 70.08 102.133 68.587 100.373 67.467C97.7981 65.8503 95.0414 64.5432 92.16 63.573C90.8731 63.0407 89.6096 62.4535 88.373 61.813C87.68 61.44 87.04 60.96 86.56 60.373C86.24 59.946 86.027 59.467 86.027 58.987C86.027 58.507 86.187 57.974 86.453 57.547C86.827 57.014 87.413 56.64 88.106 56.48C89.12 56.214 90.24 56.053 91.306 56.106C93.333 56.106 95.306 56.373 97.28 56.8C99.094 57.173 100.8 57.76 102.4 58.614C102.613 58.72 102.88 58.72 103.36 58.614C103.444 58.5525 103.511 58.472 103.558 58.3791C103.604 58.2863 103.628 58.1838 103.627 58.08V49.387C103.627 49.173 103.573 48.96 103.52 48.747C103.413 48.534 103.2 48.32 102.987 48.267C101.516 47.6654 99.9748 47.2531 98.4 47.04C96.2101 46.7211 94 46.5617 91.787 46.561Z"
        fill="#31A8FF"
      />
    </svg>
  );
};

export const ShareIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path
        d="M109.831 0.449339L16.5889 23.7582C-5.68882 29.3258 -5.46844 61.0678 16.8874 66.3296L45.8925 73.1558C46.6107 73.3265 47.3716 73.1132 47.8907 72.587L81.5812 38.8967C83.6433 36.8346 87.0551 36.8346 89.1172 38.8967C91.1792 40.9588 91.1792 44.3719 89.1172 46.434L55.4127 80.1384C54.8937 80.6575 54.6744 81.4184 54.8451 82.1366L61.6641 111.113C66.926 133.468 98.6666 133.689 104.234 111.411L127.543 18.1691C130.21 7.46047 120.518 -2.22427 109.831 0.449339Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const LikeIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 114 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path
        d="M92.447 0H21.3339C7.11131 0 0 7.11131 0 21.3339V111.086C0 116.946 6.69157 120.288 11.3779 116.775L21.0423 109.528C25.2877 106.343 31.2332 106.769 34.988 110.517L49.3451 124.875C53.5124 129.042 60.2688 129.042 64.4289 124.875L78.786 110.517C82.5408 106.762 88.4863 106.343 92.7317 109.528L102.396 116.775C107.082 120.288 113.774 116.946 113.774 111.086V21.3339C113.781 7.11131 106.67 0 92.447 0ZM84.8027 55.2264C81.0906 74.2065 56.8905 85.1365 56.8905 85.1365C56.8905 85.1365 32.6903 74.2065 28.9782 55.2264C26.7026 43.5852 31.6735 31.8657 44.3103 31.8017C53.7256 31.759 56.8835 41.1745 56.8835 41.1745C56.8835 41.1745 60.0406 31.7519 69.4559 31.8017C82.1283 31.8657 87.0783 43.578 84.8027 55.2264Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const BookmarkIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 114 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path
        d="M92.447 0H21.3339C7.11131 0 0 7.11131 0 21.3339V111.086C0 116.946 6.69157 120.288 11.3779 116.775L21.0423 109.528C25.2877 106.343 31.2332 106.769 34.988 110.517L49.3451 124.875C53.5124 129.042 60.2688 129.042 64.4289 124.875L78.786 110.517C82.5408 106.762 88.4863 106.343 92.7317 109.528L102.396 116.775C107.082 120.288 113.774 116.946 113.774 111.086V21.3339C113.781 7.11131 106.67 0 92.447 0ZM86.0892 53.2495L75.2096 63.7741C74.4131 64.5422 74.0496 65.6517 74.2416 66.7397L76.7313 81.1401C77.2362 84.0628 74.1569 86.2887 71.5115 84.9162L58.4548 78.1035C57.4734 77.5915 56.3076 77.5915 55.3262 78.1035L42.2764 84.9091C39.6309 86.2886 36.5447 84.0557 37.0496 81.1329L39.5393 66.7397C39.7242 65.6517 39.3607 64.5422 38.5714 63.7741L27.6917 53.2495C25.6935 51.3153 26.7955 47.9374 29.5546 47.5462L44.6089 45.3774C45.704 45.2209 46.6504 44.5381 47.1411 43.5496L53.6621 30.4436C54.9848 27.7839 58.8031 27.7839 60.1258 30.4436L66.6468 43.5496C67.1375 44.5381 68.0839 45.2209 69.179 45.3774L84.2332 47.5462C86.9924 47.9445 88.0875 51.3153 86.0892 53.2495Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const QQIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 108 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path
        d="M53.8004 2.09954e-07C43.5175 -0.00104977 33.6247 3.93619 26.1547 11.0027C18.6847 18.0693 14.2047 27.7284 13.6354 37.9955L12.701 54.8269C11.3068 57.7983 9.99432 60.8073 8.76513 63.8506C0.829401 83.5172 -2.29369 100.797 1.80217 102.454C3.9461 103.318 7.64517 99.7278 11.8242 93.2896C13.5073 102.086 17.9133 110.13 24.419 116.284C17.8464 118.524 12.1954 121.583 12.1954 124.796C12.1954 128.053 28.0669 128.015 39.3241 127.996H39.3305C42.844 127.983 45.7943 127.944 48.1622 127.631C51.9006 128.123 55.6874 128.123 59.4258 127.631C61.7937 127.951 64.7568 127.983 68.2703 127.989C79.5339 128.015 95.399 128.053 95.399 124.796C95.399 121.583 89.748 118.53 83.1818 116.284C89.677 110.141 94.0801 102.114 95.7702 93.3344C99.93 99.747 103.623 103.318 105.754 102.454C109.85 100.797 106.739 83.5108 98.7909 63.8506C97.5769 60.8402 96.2815 57.8632 94.9062 54.9229L93.9654 37.9955C93.3961 27.7284 88.9161 18.0693 81.4461 11.0027C73.9761 3.93619 64.0833 -0.00104977 53.8004 2.09954e-07Z"
        fill="currentColor"
      />
    </svg>
  );
};
