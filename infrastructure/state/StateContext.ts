import { SnapshotType } from './Snapshot.types'
import { Reward, BalanceSnapshot, Balance, SpinState, SnapshotLabel } from './StateType.types'

export class StateContext {
  private _deviceId: string
  private _loginSource: string
  private _accessToken?: string
  private _session?: Record<string, any>

  private _snapshots: Map<SnapshotLabel, BalanceSnapshot>

  private _spin?: SpinState
  private _notes: string[]

  constructor(params: { DeviceId: string; LoginSource: string }) {
    this._deviceId = params.DeviceId
    this._loginSource = params.LoginSource
    this._accessToken = ''
    this._snapshots = new Map()
    this._spin = undefined
    this._notes = []
    this._session = {}
  }

  get deviceId(): string {
    return this._deviceId
  }

  get loginSource(): string {
    return this._loginSource
  }

  get accessToken(): any {
    return this._accessToken
  }

  get spin(): SpinState | undefined {
    return this._spin
  }

  get notes(): readonly string[] {
    return this._notes
  }

  get sessionDetails(): Record<string, any> | undefined {
    return this._session
  }

  /**
   * Returns an existing snapshot.
   * Throws an error if the snapshot does not exist.
   */
  getSnapshot(label: SnapshotLabel): BalanceSnapshot {
    const snapshotData = this._snapshots.get(label)
    if (!snapshotData) throw new Error(`Missing balance snapshot: ${label}`)
    return snapshotData
  }

  getAllSnapshots(): ReadonlyMap<SnapshotLabel, BalanceSnapshot> {
    return new Map(this._snapshots)
  }

  setAccessToken(token: string): void {
    this._accessToken = token
  }

  addNote(note: string): void {
    this._notes.push(note)
  }

  saveBalanceSnapshot(label: SnapshotLabel, balance: Balance): void {
    let dateCreated = Date.now()
    this._snapshots.set(label, {
      label,
      dateCreated: dateCreated.toString(),
      balance
    })
  }

  setSpinState(params: { selectedIndex?: number; rewards: Reward[]; balanceAfterSpin?: Balance }): void {
    this._spin = {
      selectedIndex: params.selectedIndex,
      rewards: params.rewards,
      balanceAfterSpin: params.balanceAfterSpin
    }
  }

  updateContext(params: { loginResponse: any; snapshotLabel?: SnapshotType }): void {
    const { loginResponse, snapshotLabel } = params

    if (loginResponse?.AccessToken) {
      this._accessToken = loginResponse.AccessToken
    }

    if (snapshotLabel && loginResponse?.UserBalance) {
      this.saveBalanceSnapshot(snapshotLabel, loginResponse.UserBalance)
    }

    if (loginResponse?.Session) {
      this._session = loginResponse.Session
    }
  }

  updateAfterSpin(params: { spinResponse: any; snapshotLabel?: SnapshotLabel }): void {
    const { spinResponse, snapshotLabel } = params

    const selectedIndex = spinResponse?.SelectedIndex
    const rewards: Reward[] = spinResponse?.SpinResult?.Rewards ?? []
    const balance: Balance | undefined = spinResponse?.SpinResult?.UserBalance

    this.setSpinState({
      selectedIndex,
      rewards,
      balanceAfterSpin: balance
    })

    if (snapshotLabel && balance) {
      this.saveBalanceSnapshot(snapshotLabel, balance)
    }
  }
}
