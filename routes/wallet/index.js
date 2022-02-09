var express = require("express");
var router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require("fs");

// TODO : lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다.
router.post("/newMnemonic", async (req, res) => {
  let mnemonic;
  try {
    // 랜덤으로 12글자 생성한다.
    // api를 이용해 생성된 난수를 조합해서 랜덤을 영문 시드 12글자를 받아오는 거 같다.
    mnemonic = lightwallet.keystore.generateRandomSeed();
    res.json({ mnemonic });
  } catch (err) {
    console.log(err);
  }
});

// TODO : 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
router.post("/newWallet", async (req, res) => {
  let password = req.body.password;
  let mnemonic = req.body.mnemonic;

  try {
    // keystore는 개인키를 암호화
    // lightwallet.keystore.createVault({password, seedPhrase, hdPathString}, callback)
    lightwallet.keystore.createVault(
      {
        password: password, // password: password // salt : fixture.salt // 선택적으로 salt 제공, 그렇지 않으면 고유한 솔트 생성
        seedPhrase: mnemonic, // seedPhrase : 선택적으로 12단어 시드 구문을 제공한다.
        hdPathString: "m/0'/0'/0'", // hdPathString: hdPath // 사용자 정의 HD 경로 문자열(선택 사항)
      },
      function (err, ks) {
        // 일부 메소드는 'pwDerivedKey'를 제공해야 한다.
        // 필요할 때만 개인 키를 해독할 수 있다.
        // 다음과 같은 편리한 방법으로 해당 값을 생성할 수 있다.
        // console.log(ks);
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
          ks.generateNewAddress(pwDerivedKey, 1);
          console.log(ks.generateNewAddress);
          console.log(ks);
          let address = ks.getAddresses().toString();
          let keystore = ks.serialize();
          // console.log(keystore);

          fs.writeFile("wallet.json", keystore, function (err, data) {
            if (err) {
              res.json({ code: 999, message: "실패" });
            } else {
              res.json({ code: 1, message: "성공" });
            }
          });
        });
      }
    );
  } catch (expection) {
    console.log("NewWallet ==>>>> " + exception);
  }
});

module.exports = router;
