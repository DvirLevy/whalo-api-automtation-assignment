import { SnapshotType } from "./Snapshot.types";
import {
  Reward,BalanceSnapshot,
  Balance,SpinState,SnapshotLabel}
from './StateType'

export class StateContext {
  private _deviceId: string;
  private _loginSource: string;
  private _accessToken?: string;
  private _session?:Record<string,any>

  private _snapshots: Map<SnapshotLabel, BalanceSnapshot>;

  private _spin?: SpinState;
  private _notes: string[];

  constructor(params: { DeviceId: string; LoginSource: string }) {
    this._deviceId = params.DeviceId
    this._loginSource = params.LoginSource
    this._accessToken = ''
    this._snapshots = new Map()
    this._spin = undefined;
    this._notes = []
    this._session={}
  }

  /**
   * Factory method: creates a new StateContext instance
   */
  static createTestContext(params: { DeviceId: string; LoginSource: string }): StateContext {
    return new StateContext(params);
  }

  // -------------------------
  // Getters (read-only access)
  // -------------------------

  get deviceId(): string {
    return this._deviceId;
  }

  get loginSource(): string {
    return this._loginSource;
  }

  get accessToken(): any {
    return this._accessToken;
  }

  get spin(): SpinState | undefined {
    return this._spin;
  }

  get notes(): readonly string[] {
    return this._notes;
  }

  get sessionDetails():Record<string,any> | undefined{
    return this._session
  }

  /**
   * Returns an existing snapshot.
   * Throws an error if the snapshot does not exist.
   */
  getSnapshot(label: SnapshotLabel): BalanceSnapshot {
    const snapshotData = this._snapshots.get(label);
    if (!snapshotData) throw new Error(`Missing balance snapshot: ${label}`);
    return snapshotData;
  }

  /**
   * Returns a snapshot if it exists, otherwise undefined.
   */
  tryGetSnapshot(label: SnapshotLabel): BalanceSnapshot | undefined {
    return this._snapshots.get(label);
  }

  /**
   * Returns all snapshots as a read-only copy.
   */
  getAllSnapshots(): ReadonlyMap<SnapshotLabel, BalanceSnapshot> {
    return new Map(this._snapshots);
  }

  // -------------------------
  // Mutators (state updates)
  // -------------------------

  setAccessToken(token: string): void {
    this._accessToken = token;
  }

  addNote(note: string): void {
    this._notes.push(note);
  }

  /**
   * Saves a balance snapshot for a specific label.
   */
  saveBalanceSnapshot(label: SnapshotLabel, balance: Balance): void {
    let dateCreated = Date.now()
    this._snapshots.set(label, {
      label,
      dateCreated: dateCreated.toString(),
      balance,
    });
  }

  /**
   * Updates the spin state after a wheel spin action.
   */
  setSpinState(params: { selectedIndex?: number; rewards: Reward[]; balanceAfterSpin?: Balance }): void {
    this._spin = {
      selectedIndex: params.selectedIndex,
      rewards: params.rewards,
      balanceAfterSpin: params.balanceAfterSpin,
    };
  }

  // -------------------------
  // Generic context updates from API responses
  // -------------------------

  /**
   * Updates the context using a login response:
   * - stores the access token
   * - optionally stores a balance snapshot (based on the provided label)
   */
  updateContext(params: { loginResponse: any, snapshotLabel?: SnapshotType }): void {
    const { loginResponse, snapshotLabel } = params;

    if (loginResponse?.AccessToken) {
      this._accessToken = loginResponse.AccessToken;
    }

    if (snapshotLabel && loginResponse?.UserBalance) {
      this.saveBalanceSnapshot(snapshotLabel, loginResponse.UserBalance);
    }

    if(loginResponse?.Session){
      this._session = loginResponse.Session
    }
  }

  /**
   * Updates the context using a spin response:
   * - stores rewards and selected index
   * - optionally stores a snapshot after the spin
   */
  updateAfterSpin(params: { spinResponse: any; snapshotLabel?: SnapshotLabel }): void {
    const { spinResponse, snapshotLabel } = params;

    // Based on API structure:
    // response.SelectedIndex + response.SpinResult.Rewards + response.SpinResult.UserBalance
    const selectedIndex = spinResponse?.SelectedIndex;
    const rewards: Reward[] = spinResponse?.SpinResult?.Rewards ?? [];
    const balance: Balance | undefined = spinResponse?.SpinResult?.UserBalance;

    this.setSpinState({
      selectedIndex,
      rewards,
      balanceAfterSpin: balance,
    });

    if (snapshotLabel && balance) {
      this.saveBalanceSnapshot(snapshotLabel, balance)
    }
  }

  // -------------------------
  // Static utility methods
  // -------------------------

  /**
   * Finds the rewarded coins from the rewards list.
   * Coins are defined as:
   * RewardDefinitionType = 1 && RewardResourceType = 1
   */
  static getCoinsReward(rewards: Reward[]): Reward | null {
    const coinReward = rewards.find(
      (r) => r.RewardDefinitionType === 1 && r.RewardResourceType === 1
    );
    return coinReward ?? null;
  }
}