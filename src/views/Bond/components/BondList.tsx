import { t, Trans } from "@lingui/macro";
import {
  Box,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { Token } from "src/helpers/contracts/Token";
import { useScreenSize } from "src/hooks/useScreenSize";

import { Bond } from "../hooks/useBond";
import { BondDiscount } from "./BondDiscount";
import { BondDuration } from "./BondDuration";
import { BondInfoText } from "./BondInfoText";
import { BondPrice } from "./BondPrice";

export const BondList: React.VFC<{ bonds: Bond[]; isInverseBond: boolean }> = ({ bonds, isInverseBond }) => {
  const isSmallScreen = useScreenSize("md");

  if (bonds.length === 0)
    return (
      <Box display="flex" justifyContent="center">
        <Typography variant="h4">
          <Trans>No active bonds</Trans>
        </Typography>
      </Box>
    );

  if (isSmallScreen)
    return (
      <>
        <Box my="24px" textAlign="center">
          <Typography variant="body2" color="textSecondary" style={{ fontSize: "1.075em" }}>
            <BondInfoText isInverseBond={isInverseBond} />
          </Typography>
        </Box>

        {sortByDiscount(bonds).map(bond => (
          <BondCard key={bond.id} bond={bond} isInverseBond={isInverseBond} />
        ))}
      </>
    );

  return (
    <>
      <BondTable isInverseBond={isInverseBond}>
        {sortByDiscount(bonds).map(bond => (
          <BondRow key={bond.id} bond={bond} isInverseBond={isInverseBond} />
        ))}
      </BondTable>

      <Box mt="24px" textAlign="center" width="70%" mx="auto">
        <Typography variant="body2" color="textSecondary" style={{ fontSize: "1.075em" }}>
          <BondInfoText isInverseBond={isInverseBond} />
        </Typography>
      </Box>
    </>
  );
};

const BondCard: React.VFC<{ bond: Bond; isInverseBond: boolean }> = ({ bond, isInverseBond }) => (
  <Box id={bond.id + `--bond`} mt="32px">
    <Box display="flex" alignItems="center">
      <TokenStack tokens={bond.quoteToken.icons} />

      <Box display="flex" flexDirection="column" ml="8px">
        <Typography>{bond.quoteToken.name}</Typography>

        <Link href={bond.quoteToken.purchaseUrl} target="_blank">
          <Box display="flex" alignItems="center">
            <Typography>
              <Trans>Get Asset</Trans>
            </Typography>

            <Box ml="4px">
              <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
            </Box>
          </Box>
        </Link>
      </Box>
    </Box>

    <Box display="flex" justifyContent="space-between" mt="16px">
      <Typography>
        <Trans>Price</Trans>
      </Typography>

      <Typography>{bond.isSoldOut ? "--" : <BondPrice price={bond.price.inUsd} />}</Typography>
    </Box>

    <Box display="flex" justifyContent="space-between" mt="8px">
      <Typography>
        <Trans>Discount</Trans>
      </Typography>

      <Typography>{bond.isSoldOut ? "--" : <BondDiscount discount={bond.discount} />}</Typography>
    </Box>

    {isInverseBond && (
      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>
          <Trans>Payout</Trans>
        </Typography>

        <Typography>{bond.baseToken.name}</Typography>
      </Box>
    )}

    {!isInverseBond && (
      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>
          <Trans>Duration</Trans>
        </Typography>

        <Typography>
          <BondDuration duration={bond.duration} />
        </Typography>
      </Box>
    )}

    <Box mt="16px">
      <Link component={NavLink} to={isInverseBond ? `/bonds/inverse/${bond.id}` : `/bonds/${bond.id}`}>
        <TertiaryButton fullWidth>
          {isInverseBond
            ? `${t`Bond`} ${bond.quoteToken.name} ${t`for`} ${bond.baseToken.name}`
            : `${t`Bond`} ${bond.quoteToken.name}`}
        </TertiaryButton>
      </Link>
    </Box>
  </Box>
);

const BondTable: React.FC<{ isInverseBond: boolean }> = ({ children, isInverseBond }) => (
  <TableContainer>
    <Table aria-label="Available bonds" style={{ tableLayout: "fixed" }}>
      <TableHead>
        <TableRow>
          <TableCell style={{ width: isInverseBond ? "180px" : "230px", padding: "8px 0" }}>
            <Trans>Token</Trans>
          </TableCell>

          {isInverseBond && (
            <TableCell style={{ width: "180px", padding: "8px 0" }}>
              <Trans>Payout Asset</Trans>
            </TableCell>
          )}

          <TableCell style={{ padding: "8px 0" }}>
            <Trans>Price</Trans>
          </TableCell>

          <TableCell style={{ padding: "8px 0" }}>
            <Trans>Discount</Trans>
          </TableCell>

          {!isInverseBond && (
            <TableCell style={{ padding: "8px 0" }}>
              <Trans>Duration</Trans>
            </TableCell>
          )}
        </TableRow>
      </TableHead>

      <TableBody>{children}</TableBody>
    </Table>
  </TableContainer>
);

const BondRow: React.VFC<{ bond: Bond; isInverseBond: boolean }> = ({ bond, isInverseBond }) => (
  <TableRow id={bond.id + `--bond`}>
    <TableCell style={{ padding: "8px 0" }}>
      <TokenIcons token={bond.quoteToken} />
    </TableCell>

    {isInverseBond && (
      <TableCell style={{ padding: "8px 0" }}>
        <TokenIcons token={bond.baseToken} />
      </TableCell>
    )}

    <TableCell style={{ padding: "8px 0" }}>
      <Typography>{bond.isSoldOut ? "--" : <BondPrice price={bond.price.inUsd} />}</Typography>
    </TableCell>

    <TableCell style={{ padding: "8px 0" }}>
      <Typography>{bond.isSoldOut ? "--" : <BondDiscount discount={bond.discount} />}</Typography>
    </TableCell>

    {!isInverseBond && (
      <TableCell style={{ padding: "8px 0" }}>
        <Typography>{bond.isSoldOut ? "--" : <BondDuration duration={bond.duration} />}</Typography>
      </TableCell>
    )}

    <TableCell style={{ padding: "8px 0" }}>
      <Link component={NavLink} to={isInverseBond ? `/bonds/inverse/${bond.id}` : `/bonds/${bond.id}`}>
        <TertiaryButton fullWidth disabled={bond.isSoldOut}>
          {bond.isSoldOut ? "Sold Out" : t`do_bond`}
        </TertiaryButton>
      </Link>
    </TableCell>
  </TableRow>
);

const TokenIcons: React.VFC<{ token: Token }> = ({ token }) => (
  <Box display="flex" alignItems="center">
    <TokenStack tokens={token.icons} />

    <Box display="flex" flexDirection="column" ml="16px">
      <Typography>{token.name}</Typography>

      <Link color="primary" target="_blank" href={token.purchaseUrl}>
        <Box display="flex" alignItems="center">
          <Typography>
            <Trans>Get Asset</Trans>
          </Typography>

          <Box ml="4px">
            <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
          </Box>
        </Box>
      </Link>
    </Box>
  </Box>
);
