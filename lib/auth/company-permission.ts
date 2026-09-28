export const adminCompanyMap: Record<
  string,
  number
> = {

  adm_numiteg: 7,

  adm_bekami: 8,

  adm_briza: 9,

  adm_aswa: 10,

  adm_blueheron: 11,

};

export function getAdminCompanyId(
  role: string
): number | null {

  if (
    role === "it_admin"
  ) {

    return null;
  }

  return (
    adminCompanyMap[
      role as keyof typeof adminCompanyMap
    ] ?? null
  );

}

export function canEditAsset(
  role: string,
  assetCompanyId: number | null
): boolean {

  if (
    role === "it_admin"
  ) {

    return true;

  }

  const companyId =
    getAdminCompanyId(role);

  if (
    companyId === null
  ) {

    return false;

  }

  return (
    assetCompanyId ===
    companyId
  );

}

export function canExecuteMutation(
  role: string,
  toCompanyId: number | null
): boolean {

  if (
    role === "it_admin"
  ) {

    return true;

  }

  const companyId =
    getAdminCompanyId(role);

  if (
    companyId === null ||
    toCompanyId === null
  ) {

    return false;

  }

  return (
    companyId ===
    toCompanyId
  );

}

export function canApproveMutation(
  role: string,
  fromCompanyId: number | null
): boolean {

  if (
    role === "it_admin"
  ) {

    return true;

  }

  const companyId =
    getAdminCompanyId(role);

  if (
    companyId === null ||
    fromCompanyId === null
  ) {

    return false;

  }

  return (
    companyId ===
    fromCompanyId
  );

}