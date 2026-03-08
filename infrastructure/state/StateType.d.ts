import { SnapshotType } from "./Snapshot.types";

export interface Balance {
  Coins: number;
  Gems?: number;
  Energy: number;
}

export interface Reward {
  RewardDefinitionType: number;
  RewardResourceType: number;
  Amount: number;
  Multiplier?: number;   ///****************check if neaded; already in payload ******/
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
