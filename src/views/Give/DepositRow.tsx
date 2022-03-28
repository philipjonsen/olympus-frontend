import "./YieldRecipients.scss";

import { t } from "@lingui/macro";
import { Box, Divider, TableCell, TableRow, Tooltip, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { SecondaryButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { SubmitCallback } from "src/views/Give/Interfaces";

import { Project } from "../../components/GiveProject/project.type";
import { error } from "../../slices/MessagesSlice";
import { useDecreaseGive, useIncreaseGive } from "./hooks/useEditGive";
import { ManageDonationModal, WithdrawSubmitCallback } from "./ManageDonationModal";
import data from "./projects.json";

interface IUserDonationInfo {
  date: string;
  deposit: string;
  recipient: string;
  yieldDonated: string;
}

interface DepositRowProps {
  depositObject: IUserDonationInfo;
}

export const DepositTableRow = ({ depositObject }: DepositRowProps) => {
  const dispatch = useDispatch();
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const increaseMutation = useIncreaseGive();
  const decreaseMutation = useDecreaseGive();

  const getRecipientTitle = (address: string): string => {
    const project = projectMap.get(address);
    if (!project) return isMediumScreen || isSmallScreen ? "Custom" : "Custom Recipient";

    if (!project.owner) return isSmallScreen ? project.title.substring(0, 9) + "..." : project.title;

    return project.owner + " - " + project.title;
  };

  const handleManageModalCancel = () => {
    setIsManageModalOpen(false);
  };

  const handleEditModalSubmit: SubmitCallback = async (
    walletAddress,
    eventSource,
    depositAmount,
    depositAmountDiff,
  ) => {
    if (!depositAmountDiff) {
      return dispatch(error(t`Please enter a value!`));
    }

    if (depositAmountDiff.eq(new BigNumber("0"))) return;

    if (depositAmountDiff.isGreaterThan(new BigNumber("0"))) {
      increaseMutation.mutate({ amount: depositAmountDiff.toFixed(), recipient: walletAddress });
    } else {
      const subtractionAmount = depositAmountDiff.multipliedBy(new BigNumber("-1"));
      decreaseMutation.mutate({ amount: subtractionAmount.toFixed(), recipient: walletAddress });
    }

    setIsManageModalOpen(false);
  };

  // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
  // Else use standard call
  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (walletAddress, eventSource, depositAmount) => {
    decreaseMutation.mutate({ amount: depositAmount.toFixed(), recipient: walletAddress });

    setIsManageModalOpen(false);
  };

  return (
    <Box>
      <TableRow>
        {!isSmallScreen && (
          <TableCell align="left" className="deposit-date-cell">
            <Typography variant="h6">{depositObject.date}</Typography>
          </TableCell>
        )}
        <TableCell align="left" className="deposit-recipient-cell">
          <Tooltip title={depositObject.recipient} arrow>
            <Typography variant={isSmallScreen ? "body1" : "h6"}>
              {getRecipientTitle(depositObject.recipient)}
            </Typography>
          </Tooltip>
        </TableCell>
        {!isSmallScreen && (
          <TableCell align="right" className="deposit-deposited-cell">
            <Typography variant="h6">{parseFloat(depositObject.deposit).toFixed(2)} sOHM</Typography>
          </TableCell>
        )}
        <TableCell align="right" className="deposit-yield-cell">
          <Typography variant={isSmallScreen ? "body1" : "h6"}>
            {parseFloat(depositObject.yieldDonated).toFixed(2)} sOHM
          </Typography>
        </TableCell>
        <TableCell align="right" className="deposit-manage-cell">
          <SecondaryButton onClick={() => setIsManageModalOpen(true)} fullWidth>
            Manage
          </SecondaryButton>
        </TableCell>
      </TableRow>
      <Divider />

      <ManageDonationModal
        isModalOpen={isManageModalOpen}
        submitEdit={handleEditModalSubmit}
        submitWithdraw={handleWithdrawModalSubmit}
        cancelFunc={handleManageModalCancel}
        currentWalletAddress={depositObject.recipient}
        currentDepositAmount={new BigNumber(depositObject.deposit)}
        depositDate={depositObject.date}
        yieldSent={depositObject.yieldDonated}
        project={projectMap.get(depositObject.recipient)}
        key={"manage-modal-" + depositObject.recipient}
        eventSource={"My Donations"}
      />
    </Box>
  );
};
