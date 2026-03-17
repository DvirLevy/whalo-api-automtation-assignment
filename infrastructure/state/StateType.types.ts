import { SnapshotType } from './Snapshot.types'

export type UserData = {
  DeviceId: string
  LoginSource: string
}
export type Balance = {
  Coins: number
  Gems?: number
  Energy: number
}

export type Reward = {
  RewardDefinitionType: number
  RewardResourceType: number
  Amount: number
  Multiplier?: number
  TrackingId?: string
}

export type SnapshotLabel = SnapshotType.BEFORE_SPIN | SnapshotType.AFTER_SPIN | SnapshotType.AFTER_RELOGIN

export type BalanceSnapshot = {
  label: SnapshotLabel
  dateCreated: string
  balance: Balance
}

export type SpinState = {
  selectedIndex?: number
  rewards: Reward[]
  balanceAfterSpin?: Balance
}
