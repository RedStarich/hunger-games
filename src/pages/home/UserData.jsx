import * as React from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";

import { OFF_URL } from "../../const";

const fetchUserData = async (userName) => {
  const editorPromise = axios
    .get(`${OFF_URL}/editor/${userName}.json?fields=count`)
    .then(({ data }) => {
      return data?.count;
    })
    .catch(() => undefined);
  const contributorPromise = axios
    .get(`${OFF_URL}/contributor/${userName}.json?fields=count`)
    .then(({ data }) => {
      return data?.count;
    })
    .catch(() => undefined);
  const photographerPromise = axios
    .get(`${OFF_URL}/photographer/${userName}.json?fields=count`)
    .then(({ data }) => {
      return data?.count;
    })
    .catch(() => undefined);

  const [editorCount, contributorCount, photographerCount] = await Promise.all([
    editorPromise,
    contributorPromise,
    photographerPromise,
  ]);

  return { editorCount, contributorCount, photographerCount };
};

const CountCard = (props) => {
  const { translationKey, value } = props;

  const { t } = useTranslation();

  return (
    <Card sx={{ width: 300 }} elevation={3}>
      <CardContent>
        <Typography
          sx={{ fontSize: 18, mb: 0 }}
          color="text.primary"
          gutterBottom
        >
          {t(`home.statistics.${translationKey}.title`)}
        </Typography>
        <Typography
          sx={{ fontSize: 15, mb: 1 }}
          color="text.secondary"
          gutterBottom
        >
          {t(`home.statistics.${translationKey}.description`)}
        </Typography>
        <Typography variant="h3" color="text.primary" component="div">
          {value?.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

const UserData = ({ userName }) => {
  const { t } = useTranslation();
  const [counts, setCounts] = React.useState({});

  React.useEffect(() => {
    fetchUserData(userName)
      .then((counts) => {
        setCounts(counts);
      })
      .catch(() => {});
  }, [userName]);

  return (
    <Box sx={{ p: 2, mb: 10, textAlign: "center" }}>
      <Typography component="h3" variant="h5" sx={{ pb: 3 }}>
        {t("home.statistics.title", { userName })}
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems={{ xs: "center"}}
      >
        {Object.keys(counts).map((countType) => (
          <CountCard
            key={countType}
            translationKey={countType}
            value={counts[countType]}
            sx = {{
              display: "flex",
              flexDirection: "column",
              minHeight: "100px",
              textAlign: "center",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
  
};
export default UserData;
