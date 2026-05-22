import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Role = "owner" | "partner";
export type PartnerType = "veterinarian" | "groomer" | "trainer" | "nutritionist" | "behaviorist" | "breeder" | "seller";

interface RoleContextValue {
  role: Role;
  partnerType?: PartnerType;
  setRole: (r: Role, type?: PartnerType) => void;
}

const KEY = "@petai:role";
const TYPE_KEY = "@petai:partner-type";

const RoleContext = createContext<RoleContextValue>({
  role: "owner",
  setRole: () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("owner");
  const [partnerType, setPartnerType] = useState<PartnerType | undefined>(undefined);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => { if (v === "partner" || v === "owner") setRoleState(v); });
    AsyncStorage.getItem(TYPE_KEY).then((v) => { if (v) setPartnerType(v as PartnerType); });
  }, []);

  const setRole = (r: Role, type?: PartnerType) => {
    setRoleState(r);
    if (type) setPartnerType(type);
    AsyncStorage.setItem(KEY, r).catch(() => {});
    if (type) AsyncStorage.setItem(TYPE_KEY, type).catch(() => {});
  };

  return (
    <RoleContext.Provider value={{ role, partnerType, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
