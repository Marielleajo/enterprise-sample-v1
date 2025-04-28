export const getIsoCodeByRecordGuid = (recordGuid, countries) => {
  const country = countries.find(
    (country) => country.recordGuid === recordGuid
  );
  return country ? country.isoCode : null;
};
