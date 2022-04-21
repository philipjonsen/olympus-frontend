import { Trans } from "@lingui/macro";
import {
  Box,
  Button,
  ButtonBase,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  SvgIcon,
  Theme,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Icon, Paper, Token } from "@olympusdao/component-library";
import { useState } from "react";
import { ReactComponent as FirstStepIcon } from "src/assets/icons/step-1.svg";
import { ReactComponent as SecondStepIcon } from "src/assets/icons/step-2.svg";

const useStyles = makeStyles<Theme>(theme => ({}));

// export interface OHMGuidanceProps {}

/**
 * Component for Displaying Guidance
 */
const Guidance = () => {
  const classes = useStyles();
  const [inputQuantity, setInputQuantity] = useState("");
  const [outputQuantity, setOutputQuantity] = useState("");
  const [zapToken, setZapToken] = useState("");
  const hasTokenAllowance = true;
  const buttonIconStyle = { height: "16px", width: "16px", marginInline: "6px" };

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);
  const [outputModalOpen, setOutputModalOpen] = useState(false);
  const handleOutputOpen = () => setOutputModalOpen(true);
  const handleOutputClose = () => setOutputModalOpen(false);

  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const handleSlippageModalOpen = () => setSlippageModalOpen(true);
  const handleSlippageModalClose = () => setSlippageModalOpen(false);
  const [outputGOHM, setOutputGOHM] = useState<boolean | null>(null);

  return (
    <div id="stake-view">
      <Paper headerText="Guidance">
        <Typography>
          <Trans>You Pay</Trans>
        </Typography>
        <FormControl className="zap-input" variant="outlined" color="primary">
          <InputLabel htmlFor="amount-input"></InputLabel>
          {zapToken != null ? (
            <OutlinedInput
              id="zap-amount-input"
              inputProps={{ "data-testid": "zap-amount-input" }}
              type="number"
              placeholder="Enter Amount"
              className="zap-input"
              disabled={zapToken == null}
              value={inputQuantity}
              //   labelWidth={0}
              //   label="Hello"
              endAdornment={
                <InputAdornment position="end">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minWidth: "50px",
                    }}
                  >
                    <Box flexDirection="column" display="flex">
                      <Box flexDirection="row" display="flex" alignItems="center" justifyContent="flex-end">
                        <ButtonBase onClick={handleOpen}>
                          <Box width="10px" />
                          <Typography>PLACEHOLDER</Typography>
                          <Icon name="arrow-down" />
                        </ButtonBase>
                      </Box>

                      <Box height="5px" />
                      <Box flexDirection="row" display="flex" alignItems="center">
                        <Typography color="textSecondary">BALANCE PLACEHOLDER</Typography>
                        <Box width="10px" />
                        <ButtonBase>
                          <Typography>
                            <b>Max</b>
                          </Typography>
                        </ButtonBase>
                      </Box>
                    </Box>
                  </div>
                </InputAdornment>
              }
            />
          ) : (
            <Box className="zap-input" data-testid="zap-input">
              <Button variant="contained" className="zap-input" onClick={handleOpen} color="primary">
                <Box flexDirection="row" display="flex" alignItems="center" justifyContent="end" flexGrow={1}>
                  <Typography>
                    <Trans>Select Token</Trans>
                  </Typography>
                  <Icon name="arrow-down" />
                </Box>
              </Button>
            </Box>
          )}
        </FormControl>
        <Box minHeight="24px" display="flex" justifyContent="center" alignItems="center" width="100%">
          <Icon name="arrow-down" />
        </Box>

        <Typography>
          <Trans>You Get</Trans>
        </Typography>
        <FormControl className="zap-input" variant="outlined" color="primary">
          <InputLabel htmlFor="amount-input"></InputLabel>
          {outputGOHM == null ? (
            <Box className="zap-input">
              <Button
                variant="contained"
                className="zap-input"
                onClick={handleOutputOpen}
                color="primary"
                disabled={zapToken == null}
                data-testid="zap-output"
              >
                <Box flexDirection="row" display="flex" alignItems="center" justifyContent="end" flexGrow={1}>
                  <Typography>
                    <Trans>Select Token</Trans>
                  </Typography>
                  <Icon name="arrow-down" />
                </Box>
              </Button>
            </Box>
          ) : (
            <OutlinedInput
              id="zap-amount-output"
              type="number"
              placeholder="Enter Amount"
              className="zap-input"
              inputProps={{ "data-testid": "zap-amount-output" }}
              value={outputQuantity}
              disabled={zapToken == null}
              labelWidth={0}
              endAdornment={
                <InputAdornment position="end">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minWidth: "50px",
                    }}
                  >
                    <Box flexDirection="column" display="flex">
                      <Box flexDirection="row" display="flex" alignItems="center" justifyContent="flex-end">
                        <ButtonBase onClick={handleOutputOpen}>
                          <Token name="sOHM" />
                          <Box width="10px" />
                          <Typography>Placeholder</Typography>
                          <Icon name="arrow-down" />
                        </ButtonBase>
                      </Box>
                      <Box flexDirection="row" display="flex" alignItems="center">
                        <Typography color="textSecondary">Balance</Typography>
                      </Box>
                    </Box>
                  </div>
                </InputAdornment>
              }
            />
          )}
        </FormControl>
        <Box
          justifyContent="space-between"
          flexDirection="row"
          display="flex"
          width="100%"
          marginY="4px"
          alignItems="center"
        >
          <Typography>
            <Trans>Slippage Tolerance</Trans>
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography>SLIPPAGE PLACEHOLDER %</Typography>
            <Box width="8px" />
            <IconButton name="settings" onClick={handleSlippageModalOpen} className="zap-settings-icon">
              <Icon name="settings" className="zap-settings-icon" />
            </IconButton>
          </Box>
        </Box>
        <Box justifyContent="space-between" flexDirection="row" display="flex" width="100%" marginY="8px">
          <Typography>
            <Trans>Exchange Rate</Trans>
          </Typography>
        </Box>
        <Box
          justifyContent="space-between"
          flexDirection="row"
          display="flex"
          marginTop="8px"
          marginBottom="36px"
          width="100%"
        >
          <Typography>
            <Trans>Minimum You Get</Trans>
          </Typography>
          <Typography>Minimum Placeholder</Typography>
        </Box>
        {hasTokenAllowance ? (
          <Button fullWidth className="zap-stake-button" variant="contained" color="primary">
            <Trans>Enter Amount</Trans>
          </Button>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button fullWidth className="zap-stake-button" variant="contained" color="primary">
                {/* {txnButtonText(pendingTransactions, approveTxnName, "Approve")} */}
                <Box display="flex" flexDirection="row">
                  <SvgIcon component={FirstStepIcon} style={buttonIconStyle} viewBox={"0 0 16 16"} />
                  <Typography>
                    <Trans>Approve</Trans>
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button fullWidth className="zap-stake-button" variant="contained" color="primary">
                <Box display="flex" flexDirection="row" alignItems="center">
                  <SvgIcon component={SecondStepIcon} style={buttonIconStyle} viewBox={"0 0 16 16"} />
                  <Typography>
                    {outputQuantity === "" ? (
                      <Trans>Enter Amount</Trans>
                    ) : +outputQuantity >= 0.5 || outputGOHM ? (
                      <Trans>Zap-Stake</Trans>
                    ) : (
                      <Trans>Minimum Output Amount: 0.5</Trans>
                    )}
                  </Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>
        )}
        {/* {SelectTokenModal(handleClose, modalOpen, zapTokenBalances.isLoading, handleSelectZapToken, zapperCredit, {
        regularTokens: tokensBalance,
      })}
      {SelectTokenModal(handleOutputClose, outputModalOpen, false, handleSelectOutputToken, zapperCredit, {
        output: true,
      })}
      {SlippageModal(handleSlippageModalClose, slippageModalOpen, customSlippage, setCustomSlippage, zapperCredit)} */}
      </Paper>
    </div>
  );
};

export default Guidance;
