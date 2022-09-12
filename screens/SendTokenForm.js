import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components";
import { TouchableOpacity } from "react-native-gesture-handler";

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";
import { selectedSendToken } from "./SendTokenChoose";
// const provider = ethers.getDefaultProvider("ropsten");

var contract_address = "";
const send_address = "0x9381D7598F28fAbd2f94Aa9d01B4040C5F436197"
const private_key = "69b2ce785561f97e2aa896e67f6f61e9c8442a9f11b3cbb476439219141db91f";
const gas_limit = "0x100000";

window.ethersProvider = new ethers.providers.InfuraProvider("ropsten")
const SendTokenFormScreen = ({ navigation }) => {
  const [recipentAddress, setRecipentAddress] = React.useState(null);
  const [send_token_amount, setAmount] = React.useState('0.0');

  useEffect(() => {
    if (selectedSendToken == "btc") contract_address = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
    else if (selectedSendToken == "bnb") contract_address = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
    else if (selectedSendToken == "xrp") contract_address = "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE";
    else if (selectedSendToken == "sol") contract_address = "0x41848d32f281383f214c69b7b248dc7c2e0a7374";
  })
  const sendToken = () => {
    send_token(contract_address, send_token_amount, recipentAddress, send_address, private_key);
  }
  function send_token(
    contract_address,
    send_token_amount,
    recipentAddress,
    send_account,
    private_key
  ) {
    console.log("send transaction");
    let wallet = new ethers.Wallet(private_key)
    let walletSigner = wallet.connect(window.ethersProvider)

    window.ethersProvider.getGasPrice().then((currentGasPrice) => {
      let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
      console.log(`gas_price: ${gas_price}`)

      if (contract_address) {
        // general token send
        let contract = new ethers.Contract(
          contract_address,
          send_abi,
          walletSigner
        )

        // How many tokens?
        let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18)
        console.log(`numberOfTokens: ${numberOfTokens}`)

        // Send tokens
        contract.transfer(recipentAddress, numberOfTokens).then((transferResult) => {
          console.dir(transferResult)
          alert("sent token")
        })
      } // ether send
      else {
        const tx = {
          from: send_account,
          to: recipentAddress,
          value: ethers.utils.parseEther(send_token_amount),
          nonce: window.ethersProvider.getTransactionCount(
            send_account,
            "latest"
          ),
          gasLimit: ethers.utils.hexlify(gas_limit), // 100000
          gasPrice: gas_price,
        }
        console.log(tx)
        try {
          walletSigner.sendTransaction(tx).then((transaction) => {
            console.log(transaction)
            alert("Send finished!")
          })
        } catch (error) {
          alert("failed to send!!")
        }
      }
    })
  }
  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back"} color="#fff" size={28} />
        </TouchableOpacity>
        <HeaderText>Send {selectedSendToken.toUpperCase()}</HeaderText>
        <Continue onPress={() => sendToken()}>Continue</Continue>
      </Header>
      <Body>
        <RecipientInfoContainer>
          <Recipient>
            <RecipientAddress placeholder="Recipient Address" value={recipentAddress} onChangeText={setRecipentAddress} />
            <Paste>
              <Ionicons name={"clipboard-outline"} color="#3275bb" size={24} />
              <PasteText>Paste</PasteText>
            </Paste>
          </Recipient>
          <AmountContainer>
            <Amount placeholder="Amount BTC" value={send_token_amount} onChangeText={setAmount} />
            <MaxContainer>
              <Max>Max</Max>
              <TokenName>{selectedSendToken.toUpperCase()}</TokenName>
            </MaxContainer>
          </AmountContainer>
          <AmountInUSD>~$146,577,914.13</AmountInUSD>
        </RecipientInfoContainer>
      </Body>
    </Container>
  );
};

export default SendTokenFormScreen;

const Container = styled.View`
  flex: 1;
  background: #fff;
`;
const Header = styled.View`
  background: #3275bb;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  width: 100%;
`;
const HeaderText = styled.Text`
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
`;
const Continue = styled.Text`
  text-transform: uppercase;
  color: #fff;
  font-weight: bold;
`;
const Body = styled.View``;
const RecipientInfoContainer = styled.View`
  padding: 0 20px 0 20px;
  margin: 0 10px;
`;
const Recipient = styled.View`
  height: 60px;
  border-color: #eaeaea;
  border-width: 1px;
  border-radius: 5px;
  padding: 0 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0 30px 0;
`;
const RecipientAddress = styled.TextInput`
  height: 60px;
  font-size: 16px;
`;
const Paste = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const PasteText = styled.Text`
  color: #3275bb;
  text-transform: uppercase;
  margin-left: 10px;
  font-weight: bold;
`;
const AmountContainer = styled.View`
  height: 60px;
  border-color: #eaeaea;
  border-width: 1px;
  border-radius: 5px;
  padding: 0 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 30px 0;
`;
const Amount = styled.TextInput`
  height: 60px;
  font-size: 16px;
`;
const MaxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Max = styled.Text`
  color: #3275bb;
  text-transform: uppercase;
  font-weight: bold;
`;
const TokenName = styled.Text`
  color: #3275bb;
  text-transform: uppercase;
  margin-left: 10px;
  font-weight: bold;
`;
const AmountInUSD = styled.Text`
  color: #979797;
`;
