import { t } from "@lingui/macro";
import { Grid, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { DataRow, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { NetworkId } from "src/constants";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useRecipientInfo, useRedeemableBalance, useTotalDonated } from "src/hooks/useGiveInfo";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useWeb3Context } from "src/hooks/web3Context";
import { loadAccountDetails } from "src/slices/AccountSlice";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import { Project } from "../../components/GiveProject/project.type";
import { redeemBalance, redeemMockBalance } from "../../slices/RedeemThunk";
import { DonationInfoState } from "./Interfaces";
import data from "./projects.json";
import { RedeemCancelCallback, RedeemYieldModal } from "./RedeemYieldModal";

export default function RedeemYield() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, address, connected, networkId } = useWeb3Context();
  const [isRedeemYieldModalOpen, setIsRedeemYieldModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));

  const isAppLoading = useSelector((state: DonationInfoState) => state.app.loading);

  const redeemableBalance = useRedeemableBalance(address).data;

  const recipientInfo = useRecipientInfo(address).data;

  const totalDonated = useTotalDonated(projectMap.get(address) ? address : "").data;

  const stakingRebase = useStakingRebaseRate().data;

  const fiveDayRate = stakingRebase ? Math.pow(1 + stakingRebase, 5 * 3) - 1 : 0;

  const pendingTransactions = useSelector((state: DonationInfoState) => {
    return state.pendingTransactions;
  });

  const redeemableBalanceNumber: BigNumber = redeemableBalance ? new BigNumber(redeemableBalance) : new BigNumber(0);

  const totalDeposit = new BigNumber(recipientInfo && recipientInfo.totalDebt ? recipientInfo.totalDebt : 0);

  const stakingRebasePercentage = new BigNumber(stakingRebase ? stakingRebase : 0).multipliedBy(100);
  const nextRewardValue = new BigNumber(stakingRebase ? stakingRebase : 0).multipliedBy(totalDeposit);

  const fiveDayRateValue = new BigNumber(fiveDayRate ? fiveDayRate : 0).multipliedBy(100);

  const isProject = projectMap.get(address);

  /**
   * This ensures that the formatted string has a maximum of 4
   * decimal places, while trimming trailing zeroes.
   *
   * @param number
   * @returns string
   */
  const getTrimmedBigNumber = (number: BigNumber) => {
    return number.toNumber().toFixed(4).toString();
  };

  const isRecipientInfoLoading = !recipientInfo || recipientInfo?.totalDebt == "";

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (connected) {
      loadAccountDetails({ networkID: networkId, provider, address });
    }
  }, [connected]);

  // Get project sOHM yield goal and return as a number
  const getRecipientGoal = (address: string): number => {
    const project = projectMap.get(address);
    if (project) return parseFloat(project.depositGoal.toFixed(2));

    return 0;
  };

  // Get the amount of sOHM yield donated by the current user and return as a number
  const getRecipientDonated = (): number => {
    if (!totalDonated) return 0;

    return parseFloat(totalDonated);
  };

  // Checks that the current user can redeem some quantity of sOHM
  const canRedeem = () => {
    if (!address) return false;

    if (isRecipientInfoLoading) return false;

    if (isPendingTxn(pendingTransactions, "redeeming")) return false;

    if (redeemableBalanceNumber.eq(0))
      // If the available amount is 0
      return false;

    return true;
  };

  const handleRedeemButtonClick = () => {
    setIsRedeemYieldModalOpen(true);
  };

  const handleRedeemYieldModalSubmit = async () => {
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
      await dispatch(redeemMockBalance({ address, provider, networkID: networkId, eventSource: "Redeem" }));
    } else {
      await dispatch(redeemBalance({ address, provider, networkID: networkId, eventSource: "Redeem" }));
    }
    setIsRedeemYieldModalOpen(false);
  };

  const handleRedeemYieldModalCancel: RedeemCancelCallback = () => {
    setIsRedeemYieldModalOpen(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" align="center">
          {isRecipientInfoLoading ? <Skeleton /> : redeemableBalanceNumber.toNumber().toFixed(2)} sOHM
        </Typography>
        <Typography variant="body1" align="center" className="subtext">
          Redeemable Yield
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs />
          <Grid item xs={12} sm={6}>
            <PrimaryButton onClick={() => handleRedeemButtonClick()} disabled={!canRedeem()} fullWidth>
              {txnButtonText(pendingTransactions, "redeeming", t`Redeem Yield`)}
            </PrimaryButton>
          </Grid>
          <Grid item xs />
        </Grid>
      </Grid>
      {isProject ? (
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center">
                  {getRecipientGoal(address)}
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  sOHM Goal
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center">
                  {getRecipientDonated()}
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  {isSmallScreen ? "Total Donated" : "Total sOHM Donated"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5" align="center">
                  {getRecipientDonated() / getRecipientGoal(address)}%
                </Typography>
                <Typography variant="body1" align="center" className="subtext">
                  of sOHM Goal
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
      <Grid item xs={12}>
        <Box>
          <DataRow
            title={t`Deposited sOHM`}
            balance={`${getTrimmedBigNumber(totalDeposit)} ${t`sOHM`}`}
            isLoading={isRecipientInfoLoading}
          />
          <DataRow
            title={t`Redeemable Amount`}
            balance={`${getTrimmedBigNumber(redeemableBalanceNumber)} ${t`sOHM`}`}
            isLoading={isRecipientInfoLoading}
          />
          <DataRow
            title={t`Next Reward Amount`}
            balance={`${getTrimmedBigNumber(nextRewardValue)} ${t`sOHM`}`}
            isLoading={isAppLoading}
          />
          <DataRow
            title={t`Next Reward Yield`}
            balance={`${getTrimmedBigNumber(stakingRebasePercentage)}%`}
            isLoading={isAppLoading}
          />
          <DataRow
            title={t`ROI (5-Day Rate)`}
            balance={`${getTrimmedBigNumber(fiveDayRateValue)}%`}
            isLoading={isAppLoading}
          />
        </Box>
      </Grid>
      <Grid item>
        <RedeemYieldModal
          isModalOpen={isRedeemYieldModalOpen}
          callbackFunc={handleRedeemYieldModalSubmit}
          cancelFunc={handleRedeemYieldModalCancel}
          deposit={totalDeposit}
          redeemableBalance={redeemableBalanceNumber}
        />
      </Grid>
    </Grid>
  );
}
