import { SnapshotType } from "./Snapshot.types";

export type UserData = {
  DeviceId:string,
  LoginSource:string
}
export interface Balance {
  Coins: number;
  Gems?: number;
  Energy: number;
}

export interface Reward {
  RewardDefinitionType: number;
  RewardResourceType: number;
  Amount: number;
  Multiplier?: number;  
  TrackingId?: string;
}

export type SnapshotLabel = SnapshotType.BEFORE_SPIN | SnapshotType.AFTER_SPIN | SnapshotType.AFTER_RELOGIN;

export interface BalanceSnapshot {
  label: SnapshotLabel;
  dateCreated: string;
  balance: Balance;
}

export interface SpinState {
  selectedIndex?: number;
  rewards: Reward[];
  balanceAfterSpin?: Balance;
}
