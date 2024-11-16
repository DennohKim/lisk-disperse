import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

import Disperse from "../artifacts/Disperse.json";
import { getNetworkInfo, parseText } from "../utils/index";
import Recipients from "./Recipients";
import ConfirmEther from "./ConfirmEther";
import { NetworkContext } from "../App";
import { TxStatus } from "../types/Transaction";
import { RecipientInfo } from "../types/Recipient";

type EtherProps = {
  address: string;
};

const Celo = ({ address }: EtherProps) => {
  const [celoBalance, setCeloBalance] = useState<string | null>(null);
  const [textValue, setTextValue] = useState("");
  const [total, setTotal] = useState<ethers.BigNumber | null>(null);
  const [recipientsData, setRecipientsData] = useState<RecipientInfo[]>([]);
  const [remaining, setRemaining] = useState<string | null>(null);
  const { chainId } = useContext(NetworkContext);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);
  const networkInfo = getNetworkInfo(chainId);
  const disperseAddress = networkInfo?.disperseAddress;

  const getCeloBalance = async () => {
    const { ethereum } = window;
    if (!celoBalance) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(address);
      const celoBalance = ethers.utils.formatEther(balance);
      setCeloBalance(celoBalance);
    }
  };

  useEffect(() => {
    getCeloBalance();
  }, []);

  useEffect(() => {
    setRecipientsData(parseText(textValue));
  }, [textValue]);

  useEffect(() => {
    if (recipientsData.length > 0) {
      let newTotal = recipientsData[0].value;
      for (let i = 1; i < recipientsData.length; i++) {
        newTotal = newTotal.add(recipientsData[i].value);
      }
      setTotal(newTotal);
    } else {
      setTotal(null);
    }
  }, [recipientsData]);

  const disperseEther = async () => {
    try {
      setTxStatus(null);
      const { ethereum } = window;
      if (ethereum && disperseAddress) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const disperseContract = new ethers.Contract(
          disperseAddress,
          Disperse.abi,
          signer
        );

        const recipients = recipientsData.map((recipient) => recipient.address);
        const values = recipientsData.map((recipient) => recipient.value);

        console.log("Dispersing CELO now");
        console.log(total);
        const txn = await disperseContract.disperseEther(recipients, values, {
          value: total,
        });
        setTxStatus({
          hash: txn.hash,
          status: "pending",
        });
        await txn.wait();
        setTxStatus({
          hash: txn.hash,
          status: "success",
        });
        console.log("Completed dispersing celo");
      }
    } catch (error) {
      console.log("error occured while dispersing celo");
      console.log(error);
    }
  };

  useEffect(() => {
    if (celoBalance && total) {
      const tokenBalance = ethers.utils.parseEther(celoBalance);
      const remaining = tokenBalance.sub(total);
      setRemaining(ethers.utils.formatEther(remaining));
    } else {
      setRemaining(null);
    }
  }, [total]);

  return (
    <p className="pt-4 text-l font-light italic">
      you have {celoBalance} <span className="pt-1 text-sm">CELO</span>
      <Recipients
        textValue={textValue}
        setTextValue={setTextValue}
        tokenSymbol={"CELO"}
      />
      {recipientsData.length > 0 && (
        <ConfirmEther
          recipientsData={recipientsData}
          total={total}
          disperse={disperseEther}
          tokenBalance={celoBalance}
          remaining={remaining}
          txStatus={txStatus}
        />
      )}
    </p>
  );
};

export default Celo;