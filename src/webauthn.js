//UTIL関数
//文字列からByteArrayに移動する
const enc = new TextEncoder();

//文字列からByteArrayに移動する別の関数、最初にエンコード
//base64としての文字列 atob（）関数の使用に注意
function strToBin(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

// 生のバイナリを文字列にエンコードする関数
// base64にエンコード btoa（）関数の使用に注意
function binToStr(bin) {
  return btoa(
    new Uint8Array(bin).reduce((s, byte) => s + String.fromCharCode(byte), "")
  );
}
///////// UTIL関数の終了 /////////

///////// WEBAUTHNを開始 /////////
const createCreds = async function() {
  ////// START サーバーが生成した情報 //////
  // 「publicKey」は通常は、サーバーによって生成される
  const publicKey = {
    // ランダムで暗号的に安全な、少なくとも16バイト
    challenge: enc.encode("someRandomStringThatSHouldBeReLLYLoooong&Random"),
    // 証明書利用者
    rp: {
      name: "react-webauthn"
    },
    user: {
      id: enc.encode("dvas0004"),
      name: "David Vassallo",
      displayName: "dvas0004"
    },
    authenticatorSelection: {
      userVerification: "preferred"
    },
    attestation: "direct",
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7 // "ES256" IANA COSE Algorithms registry
      }
    ]
  };
  ////// END サーバー生成情報 //////

  // ブラウザはpublicKeyオブジェクトを受け取り、それをWebAuthnの作成APIに渡す
  const res = await navigator.credentials.create({
    publicKey: publicKey
  });

  console.log(res);

  // 下２行には、最も重要な情報（作成された資格情報を表すID）が格納される
  // 通常は、ローカルに保存するのではなく、POSTを介してサーバーに送信する
  localStorage.setItem("rawId", binToStr(res.rawId));
  localStorage.setItem("id", binToStr(res.id));
};

const validateCreds = async function() {
  ////// START サーバー生成情報 //////
  // 通常、以下のpublicKeyオブジェクトはサーバー上に構築される
  const rawId = localStorage.getItem("rawId");
  const AUTH_CHALLENGE = "someRandomString";
  const publicKey = {
    challenge: enc.encode(AUTH_CHALLENGE),
    allowCredentials: [
      {
        id: strToBin(rawId),
        type: "public-key"
      }
    ],
    authenticatorSelection: {
      userVerification: "preferred"
    }
  };
  ////// END サーバー生成情報 //////

  // ブラウザーはpublicKeyオブジェクトを受け取り、それをWebAuthn「get」APIに渡す
  const res = await navigator.credentials.get({
    publicKey: publicKey
  });

  console.log(res);

  // ここで、結果を含むオブジェクトを作成し、サーバーに送信する
  // 通常、「extractedData」はサーバーにPOSTされる
  const extractedData = {
    id: res.id,
    rawId: binToStr(res.rawId),
    clientDataJSON: binToStr(res.response.clientDataJSON)
  };

  // これは通常サーバー上で行われ、認証チェックを行う
  const dataFromClient = JSON.parse(atob(extractedData.clientDataJSON));
  const retrievedChallenge = atob(dataFromClient.challenge);

  // 取得したチャレンジがクライアントに送信した認証チャレンジと一致することを確認する
  console.log(retrievedChallenge);
  if (retrievedChallenge === AUTH_CHALLENGE) {
    alert("ログイン成功");
  } else {
    alert("無許可");
  }
};

///////// WEBAUTHNを終了 /////////

export { createCreds, validateCreds };
