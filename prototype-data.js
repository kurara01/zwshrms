(function () {
  "use strict";

  const VERSION = 7;
  const STORAGE_KEY = "zws-hr-prototype-state-v7";
  const WINDOW_PREFIX = `${STORAGE_KEY}:`;

  const clone = value => JSON.parse(JSON.stringify(value));
  const normalizeText = value => String(value ?? "").trim().toLocaleLowerCase("zh-CN");

  function localDateTime(date = new Date()) {
    const pad = value => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function inputDateTime(date = new Date()) {
    return localDateTime(date).replace(" ", "T");
  }

  function createOrganizations() {
    return [
      { id: 1, name: "九木杂物社", code: "COMP-001", type: "company", parentId: null, leaderId: "p01", hrbpId: "", effective: "2024-01-01T00:00:00", expiry: "", status: "active", remark: "杂物社主体", employees: 0 },
      { id: 2, name: "大运营中心", code: "FUNC-001", type: "functional", parentId: 1, leaderId: "p02", hrbpId: "p04", effective: "2024-01-01T00:00:00", expiry: "", status: "active", remark: "", employees: 0 },
      { id: 3, name: "营运一部", code: "ZONE-001", type: "zone", parentId: 2, leaderId: "p02", hrbpId: "p04", effective: "2024-01-01T00:00:00", expiry: "", status: "active", remark: "", employees: 0 },
      { id: 4, name: "上海大区", code: "AREA-001", type: "area", parentId: 3, leaderId: "p03", hrbpId: "p04", effective: "2024-01-01T00:00:00", expiry: "", status: "active", remark: "", employees: 0 },
      { id: 5, name: "上海八区", code: "REG-008", type: "region", parentId: 3, leaderId: "p05", hrbpId: "", effective: "2024-01-01T00:00:00", expiry: "", status: "active", remark: "", employees: 1 },
      { id: 6, name: "正大广场店", code: "ORG-STORE-001", storeCode: "MG0001", type: "store", parentId: 5, leaderId: "p03", hrbpId: "", effective: "2024-01-01T00:00:00", expiry: "", status: "active", storeNature: "direct", storeArea: "220.50", annualRevenue: "1800.00", storeGrade: "A1", storeCategory: "cityFlagship", franchiseTransfer: "", renovationRenewal: "2025-01-10完成柜台改造", handoverStatus: "已完成", openDate: "2024-01-12", closeDate: "", province: "上海市", city: "上海市", district: "浦东新区", address: "陆家嘴西路168号", lng: "121.50123", lat: "31.23618", remark: "", employees: 8 },
      { id: 7, name: "拉斐尔云廊店", code: "ORG-STORE-002", storeCode: "MG0002", type: "store", parentId: 5, leaderId: "p06", hrbpId: "", effective: "2024-03-01T00:00:00", expiry: "", status: "active", storeNature: "hejief", storeArea: "150.00", annualRevenue: "900.00", storeGrade: "B1", storeCategory: "community", franchiseTransfer: "2026/7/16起由直营转加盟商合杰", renovationRenewal: "", handoverStatus: "已完成", openDate: "2024-03-18", closeDate: "", province: "上海市", city: "上海市", district: "浦东新区", address: "云桥路300号", lng: "121.60000", lat: "31.25000", remark: "", employees: 6 },
      { id: 8, name: "人力资源中心", code: "FUNC-HR-001", type: "functional", parentId: 1, leaderId: "p04", hrbpId: "p04", effective: "2024-01-01T00:00:00", expiry: "", status: "active", remark: "", employees: 5 },
      { id: 9, name: "南京新街口店", code: "ORG-STORE-003", storeCode: "MG0003", type: "store", parentId: 5, leaderId: "", hrbpId: "", effective: "2026-10-01T00:00:00", expiry: "", status: "pending", storeNature: "self", storeArea: "130.00", annualRevenue: "600.00", storeGrade: "B2", storeCategory: "community", franchiseTransfer: "", renovationRenewal: "", handoverStatus: "待交房", openDate: "2026-10-15", closeDate: "", province: "江苏省", city: "南京市", district: "秦淮区", address: "中山南路1号", lng: "", lat: "", remark: "筹备中", employees: 0 },
      { id: 10, name: "九木生活方式有限公司", code: "COMP-002", type: "company", parentId: null, leaderId: "", hrbpId: "", effective: "2024-01-01T00:00:00", expiry: "", status: "active", remark: "多公司示例", employees: 0 },
      { id: 11, name: "上海七区", code: "REG-007", type: "region", parentId: 4, leaderId: "p05", hrbpId: "", effective: "2025-06-01T00:00:00", expiry: "", status: "active", remark: "", employees: 1 },
      { id: 12, name: "静安大悦城店", code: "ORG-STORE-004", storeCode: "MG0004", type: "store", parentId: 11, leaderId: "p06", hrbpId: "", effective: "2025-07-01T00:00:00", expiry: "", status: "active", storeNature: "direct", storeArea: "180.00", annualRevenue: "1200.00", storeGrade: "A2", storeCategory: "areaFlagship", franchiseTransfer: "", renovationRenewal: "", handoverStatus: "已完成", openDate: "2025-07-15", closeDate: "", province: "上海市", city: "上海市", district: "静安区", address: "西藏北路166号", lng: "121.47120", lat: "31.24310", remark: "", employees: 4 },
      { id: 13, name: "南京德基装修店", code: "ORG-STORE-005", storeCode: "MG0005", type: "store", parentId: 10, leaderId: "", hrbpId: "", effective: "2025-01-01T00:00:00", expiry: "", status: "stopped", storeNature: "direct", storeArea: "200.00", annualRevenue: "1000.00", storeGrade: "B1", storeCategory: "areaFlagship", franchiseTransfer: "", renovationRenewal: "2026-08-01至2026-09-30装修升级", handoverStatus: "已完成", openDate: "2025-01-18", closeDate: "", province: "江苏省", city: "南京市", district: "玄武区", address: "中山路18号", lng: "", lat: "", remark: "装修期间停用，后续重新开业", employees: 0 },
      { id: 14, name: "历史测试门店", code: "ORG-STORE-006", storeCode: "MG0006", type: "store", parentId: 5, leaderId: "", hrbpId: "", effective: "2024-01-01T00:00:00", expiry: "2025-12-31T23:59:59", status: "expired", storeNature: "self", storeArea: "128.50", annualRevenue: "650.00", storeGrade: "B2", storeCategory: "community", franchiseTransfer: "原历史说明", renovationRenewal: "2025-12-31闭店前完成续约评估", handoverStatus: "已完成", openDate: "2024-01-10", closeDate: "2025-12-31", province: "上海市", city: "上海市", district: "徐汇区", address: "历史地址", lng: "", lat: "", remark: "历史数据示例", employees: 0 }
    ];
  }

  function createPositions() {
    return [
      { id: 1, name: "高级店长", grades: [11, 12], coefficient: 1, status: "active", remark: "重点门店负责人" },
      { id: 2, name: "店长", grades: [9, 10], coefficient: 1, status: "active", remark: "门店负责人" },
      { id: 3, name: "店助", grades: [7, 8], coefficient: 1, status: "active", remark: "协助门店经营管理" },
      { id: 4, name: "高级导购", grades: [5, 6], coefficient: 1, status: "active", remark: "承担销售与带教" },
      { id: 5, name: "导购", grades: [3, 4], coefficient: 1, status: "active", remark: "门店销售岗位" },
      { id: 6, name: "兼职", grades: [1, 2], coefficient: 0.5, status: "active", remark: "社会兼职人员" },
      { id: 7, name: "实习生", grades: [1, 2], coefficient: 0.5, status: "active", remark: "在校实习人员" },
      { id: 8, name: "管培生", grades: [3, 4], coefficient: 1, status: "inactive", remark: "历史岗位，暂停使用" }
    ];
  }

  function createHeadcounts() {
    return [
      { id: 1, code: "HC00000001", storeId: 6, positionId: 2, type: "formal", start: "", end: "", plan: 1, status: "active", remark: "门店店长正式编制" },
      { id: 2, code: "HC00000002", storeId: 6, positionId: 3, type: "formal", start: "", end: "", plan: 1, status: "active", remark: "店助正式编制" },
      { id: 3, code: "HC00000003", storeId: 6, positionId: 5, type: "formal", start: "", end: "", plan: 1, status: "active", remark: "导购正式编制" },
      { id: 4, code: "HC00000004", storeId: 6, positionId: 4, type: "formal", start: "", end: "", plan: 1, status: "active", remark: "两名0.5人员共同占用" },
      { id: 5, code: "HC00000005", storeId: 7, positionId: 5, type: "temporary", start: "2026-10-01T00:00:00", end: "2026-12-31T23:59:59", plan: 1, status: "pending", remark: "国庆至年末临时编制" },
      { id: 6, code: "HC00000006", storeId: 7, positionId: 5, type: "temporary", start: "2026-07-01T00:00:00", end: "2026-08-31T23:59:59", plan: 0, status: "active", remark: "已到期，仍有关联人员" },
      { id: 7, code: "HC00000007", storeId: 12, positionId: 2, type: "formal", start: "", end: "", plan: 1, status: "stopped", remark: "历史停用编制" },
      { id: 8, code: "HC00000008", storeId: 12, positionId: 6, type: "temporary", start: "2026-06-01T00:00:00", end: "2026-08-15T23:59:59", plan: 0, status: "expired", remark: "到期且无人占用" },
      { id: 9, code: "HC00000009", storeId: 13, positionId: 6, type: "formal", start: "", end: "", plan: 0.5, status: "active", remark: "停用门店保留的招聘编制" }
    ];
  }

  function createDefaults() {
    const organizations = createOrganizations();
    const snapshotBase = clone(organizations.filter(item => ![13, 14].includes(item.id)));
    const snapshotBeforeMove = clone(snapshotBase.filter(item => ![11, 12].includes(item.id)));
    snapshotBeforeMove.find(item => item.id === 5).parentId = 4;
    const snapshotMonthEnd = clone(snapshotBase);
    snapshotMonthEnd.find(item => item.id === 5).parentId = 4;

    return {
      version: VERSION,
      organizations,
      positions: createPositions(),
      headcounts: createHeadcounts(),
      occupantsByHeadcount: {
        1: [{ name: "王芳", employeeNo: "JM0231", positionId: 2, employeeOrgId: 6 }],
        3: [{ name: "李倩", employeeNo: "JM0348", positionId: 5, employeeOrgId: 6 }],
        4: [{ name: "赵敏", employeeNo: "JM0412", positionId: 6, employeeOrgId: 6 }, { name: "周晓", employeeNo: "JM0521", positionId: 7, employeeOrgId: 6 }],
        6: [{ name: "孙悦", employeeNo: "JM0618", positionId: 6, employeeOrgId: 7 }]
      },
      organizationSnapshots: [
        { id: "S20260831", time: "2026-08-31 23:59:59", type: "月末自动快照", note: "2026年8月月末组织快照", creator: "系统", data: snapshotMonthEnd },
        { id: "S20260815", time: "2026-08-15 23:59:59", type: "月中自动快照", note: "2026年8月15日组织快照", creator: "系统", data: snapshotBeforeMove },
        { id: "S20260810", time: "2026-08-10 16:20:00", type: "手工快照", note: "上海区域调整前", creator: "张明", attachment: { name: "上海区域调整说明.txt", type: "text/plain", content: "上海区域组织调整前手工快照附件。" }, data: clone(snapshotBeforeMove) }
      ],
      organizationLogs: [
        { time: "2026-09-03 09:20:00", operator: "张明", action: "编辑组织", target: "拉斐尔云廊店", note: "门店面积（㎡）：148.00 → 150.00；门店年营业额预估（万元）：850.00 → 900.00；门店等级：B2 → B1；门店类别：未填写 → 社区标准店；加盟商转出情况：未填写 → 2026/7/16起由直营转加盟商合杰；开店协同交房表状态：未填写 → 已完成" },
        { time: "2026-09-01 14:30:00", operator: "张明", action: "调整组织层级", target: "上海八区", note: "上级组织：上海大区 → 营运一部；调整原因：区域调整", attachment: { name: "组织调整说明.txt", type: "text/plain", content: "上海八区组织层级调整说明及相关业务确认记录。" } },
        { time: "2026-09-02 11:35:00", operator: "张明", action: "编辑组织", target: "正大广场店", note: "门店具体地址：陆家嘴西路168号 → 陆家嘴西路168号B1层；经度：121.50000 → 121.50123；纬度：31.23500 → 31.23618" },
        { time: "2026-08-31 23:59:59", operator: "系统", action: "生成快照", target: "全部组织", note: "月末自动快照" }
      ],
      positionLogs: [
        { time: "2026-09-02 14:30:00", operator: "张明", action: "编辑岗位", target: "兼职", note: "编制占用数量：1 → 0.5；备注：临时用工 → 社会兼职人员" },
        { time: "2026-09-02 14:12:00", operator: "张明", action: "编辑岗位", target: "店长", note: "适用职等：8、9 → 9、10" }
      ],
      headcountLogs: [
        { time: "2026-09-02 14:30:00", operator: "系统", action: "岗位占用数量联动", code: "HC00000004", note: "实际数量：1.5 → 1；占用状态：超编待处理 → 满编；变更来源：岗位“兼职”编制占用数量调整" },
        { time: "2026-09-02 14:30:00", operator: "系统", action: "岗位占用数量联动", code: "HC00000006", note: "实际数量：1 → 0.5；变更来源：岗位“兼职”编制占用数量调整" },
        { time: "2026-09-02 14:30:00", operator: "系统", action: "岗位占用数量联动", code: "HC00000009", note: "计划数量：1 → 0.5；变更来源：岗位“兼职”编制占用数量调整" },
        { time: "2026-09-01 00:00:00", operator: "系统", action: "临时编制到期", code: "HC00000006", note: "计划数量：1 → 0；占用状态：满编 → 超编待处理" },
        { time: "2026-08-20 14:35:00", operator: "张明", action: "编辑编制", code: "HC00000005", note: "结束时间：2026-10-31 23:59:59 → 2026-12-31 23:59:59；备注：国庆临时编制 → 国庆至年末临时编制" }
      ],
      headcountRecordLogs: {
        1: [{ time: "2026-08-12 10:30:00", operator: "系统", title: "人员占用", note: "关联人员：未填写 → 王芳（JM0231）；实际数量：0 → 1；占用状态：空编 → 满编" }, { time: "2026-07-01 09:00:00", operator: "张明", title: "新增编制", note: "编制编码：未填写 → HC00000001" }],
        4: [{ time: "2026-09-02 14:30:00", operator: "系统", title: "岗位占用数量联动", note: "实际数量：1.5 → 1；占用状态：超编待处理 → 满编；变更来源：岗位“兼职”编制占用数量调整" }, { time: "2026-09-01 11:15:00", operator: "系统", title: "人员占用", note: "关联人员：未填写 → 周晓（JM0521）；实际数量：1 → 1.5；占用状态：满编 → 超编待处理" }, { time: "2026-08-18 13:20:00", operator: "系统", title: "人员占用", note: "关联人员：未填写 → 赵敏（JM0412）；实际数量：0 → 1；占用状态：空编 → 满编" }],
        6: [{ time: "2026-09-02 14:30:00", operator: "系统", title: "岗位占用数量联动", note: "实际数量：1 → 0.5；变更来源：岗位“兼职”编制占用数量调整" }, { time: "2026-09-01 00:00:00", operator: "系统", title: "临时编制到期", note: "计划数量：1 → 0；占用状态：满编 → 超编待处理" }],
        9: [{ time: "2026-09-02 14:30:00", operator: "系统", title: "岗位占用数量联动", note: "计划数量：1 → 0.5；变更来源：岗位“兼职”编制占用数量调整" }]
      },
      standardHours: [
        { id: 1, month: "2026-12", hours: 176, updatedAt: "2026-09-02 15:20:00", operator: "张明" },
        { id: 2, month: "2026-11", hours: 176, updatedAt: "2026-09-02 15:18:00", operator: "张明" },
        { id: 3, month: "2026-10", hours: 168, updatedAt: "2026-09-02 15:16:00", operator: "张明" },
        { id: 4, month: "2026-09", hours: 176, updatedAt: "2026-08-20 10:30:00", operator: "周萌" },
        { id: 5, month: "2026-08", hours: 176, updatedAt: "2026-07-22 09:12:00", operator: "周萌" },
        { id: 6, month: "2026-02", hours: 160.5, updatedAt: "2026-01-18 14:05:00", operator: "陈丽" },
        { id: 7, month: "2025-12", hours: 176, updatedAt: "2025-11-18 10:00:00", operator: "陈丽" }
      ],
      standardHoursLogs: [
        { time: "2026-09-02 15:20:00", operator: "张明", month: "2026-12", action: "新增", note: "标准工时：未填写 → 176小时" },
        { time: "2026-08-20 10:30:00", operator: "周萌", month: "2026-09", action: "编辑", note: "标准工时：175.5小时 → 176小时" }
      ]
    };
  }

  function readStoredState() {
    const candidates = [];
    if (window.name.startsWith(WINDOW_PREFIX)) candidates.push(window.name.slice(WINDOW_PREFIX.length));
    try { candidates.push(window.localStorage.getItem(STORAGE_KEY)); } catch (_) { /* file:// may disable storage */ }
    for (const candidate of candidates) {
      if (!candidate) continue;
      try {
        const parsed = JSON.parse(candidate);
        if (parsed?.version === VERSION) return parsed;
      } catch (_) { /* ignore stale prototype data */ }
    }
    return createDefaults();
  }

  const data = readStoredState();

  function save() {
    const serialized = JSON.stringify(data);
    window.name = WINDOW_PREFIX + serialized;
    try { window.localStorage.setItem(STORAGE_KEY, serialized); } catch (_) { /* same-tab state still works through window.name */ }
  }

  function organization(id) { return data.organizations.find(item => item.id === Number(id)); }
  function position(id) { return data.positions.find(item => item.id === Number(id)); }
  function headcount(id) { return data.headcounts.find(item => item.id === Number(id)); }
  function occupants(id) { return data.occupantsByHeadcount[id] || []; }
  function actualQuantity(item, coefficientOverride = null) {
    return occupants(item.id).reduce((sum, person) => {
      if (coefficientOverride && person.positionId === coefficientOverride.positionId) return sum + coefficientOverride.value;
      return sum + Number(position(person.positionId)?.coefficient || 0);
    }, 0);
  }
  function occupancyState(item, values = {}) {
    const status = values.status ?? item.status;
    if (["expired", "stopped"].includes(status)) return "none";
    const actual = values.actual ?? actualQuantity(item);
    const plan = values.plan ?? item.plan;
    if (actual === 0) return "empty";
    if (actual < plan) return "partial";
    if (actual === plan) return "full";
    return "over";
  }
  function lifecycleText(status) { return { pending: "待生效", active: "生效中", expired: "已失效", stopped: "已停用" }[status] || status; }
  function occupancyText(status) { return status ? ({ empty: "空编", partial: "部分占用", full: "满编", over: "超编待处理", none: "—" }[status] || status) : "未填写"; }
  function emptyText(value) { return value === "" || value == null ? "未填写" : String(value); }
  function change(label, before, after, formatter = emptyText) {
    return String(before ?? "") === String(after ?? "") ? "" : `${label}：${formatter(before)} → ${formatter(after)}`;
  }
  function addHeadcountSystemLog(item, action, changes, source, time = localDateTime()) {
    const note = `${changes.filter(Boolean).join("；")}${source ? `；变更来源：${source}` : ""}`;
    data.headcountLogs.unshift({ time, operator: "系统", action, code: item.code, note });
    data.headcountRecordLogs[item.id] ||= [];
    data.headcountRecordLogs[item.id].unshift({ time, operator: "系统", title: action, note });
  }
  function planFollowsPosition(item, now = new Date()) {
    if (item.status === "expired") return false;
    if (item.type === "temporary" && item.end && new Date(item.end) <= now && Number(item.plan) === 0) return false;
    return true;
  }

  function recalculateLifecycle(options = {}) {
    const { log = true } = options;
    const now = new Date();
    let changed = false;

    data.organizations.forEach(item => {
      if (["stopped", "expired"].includes(item.status)) return;
      const before = item.status;
      const after = item.effective && new Date(item.effective) > now ? "pending" : item.expiry && new Date(item.expiry) <= now ? "expired" : "active";
      if (before === after) return;
      item.status = after;
      const transitionTime = after === "active" && item.effective ? item.effective.replace("T", " ") : after === "expired" && item.expiry ? item.expiry.replace("T", " ") : localDateTime();
      if (log) data.organizationLogs.unshift({ time: transitionTime, operator: "系统", action: "组织状态自动变更", target: item.name, note: `组织状态：${lifecycleText(before)} → ${lifecycleText(after)}` });
      changed = true;
    });

    data.headcounts.forEach(item => {
      if (item.status === "stopped") return;
      const beforeStatus = item.status;
      const beforePlan = item.plan;
      const beforeActual = actualQuantity(item);
      const beforeOccupancy = occupancyState(item, { status: beforeStatus, plan: beforePlan, actual: beforeActual });
      let afterStatus = beforeStatus;
      let afterPlan = beforePlan;

      if (item.type === "formal") {
        afterStatus = "active";
        afterPlan = position(item.positionId)?.coefficient ?? afterPlan;
      } else if (new Date(item.start) > now) {
        afterStatus = "pending";
        afterPlan = position(item.positionId)?.coefficient ?? afterPlan;
      } else if (new Date(item.end) <= now) {
        afterPlan = 0;
        afterStatus = beforeActual > 0 ? "active" : "expired";
      } else {
        afterStatus = "active";
        afterPlan = position(item.positionId)?.coefficient ?? afterPlan;
      }

      item.status = afterStatus;
      item.plan = afterPlan;
      const afterOccupancy = occupancyState(item, { status: afterStatus, plan: afterPlan, actual: beforeActual });
      const changes = [
        change("计划数量", beforePlan, afterPlan),
        change("生命周期状态", beforeStatus, afterStatus, lifecycleText),
        change("占用状态", beforeOccupancy, afterOccupancy, occupancyText)
      ].filter(Boolean);
      if (!changes.length) return;
      const transitionTime = item.type === "temporary" && afterPlan === 0 ? item.end.replace("T", " ") : item.type === "temporary" && afterStatus === "active" ? item.start.replace("T", " ") : localDateTime();
      if (log) addHeadcountSystemLog(item, "编制状态自动变更", changes, "生命周期时间到达", transitionTime);
      changed = true;
    });

    if (changed) save();
    return changed;
  }

  function applyPositionCoefficientChange(positionId, oldCoefficient) {
    const changedPosition = position(positionId);
    if (!changedPosition || Number(oldCoefficient) === Number(changedPosition.coefficient)) return 0;
    const now = new Date();
    let affected = 0;

    data.headcounts.forEach(item => {
      const beforePlan = item.plan;
      const beforeActual = actualQuantity(item, { positionId: Number(positionId), value: Number(oldCoefficient) });
      const beforeOccupancy = occupancyState(item, { plan: beforePlan, actual: beforeActual });

      if (item.positionId === Number(positionId) && planFollowsPosition(item, now)) item.plan = changedPosition.coefficient;

      const afterActual = actualQuantity(item);
      const afterOccupancy = occupancyState(item, { plan: item.plan, actual: afterActual });
      const changes = [
        change("计划数量", beforePlan, item.plan),
        change("实际数量", beforeActual, afterActual),
        change("占用状态", beforeOccupancy, afterOccupancy, occupancyText)
      ].filter(Boolean);
      if (!changes.length) return;
      addHeadcountSystemLog(item, "岗位占用数量联动", changes, `岗位“${changedPosition.name}”编制占用数量调整`);
      affected += 1;
    });

    return affected;
  }

  save();
  window.PrototypeData = {
    data,
    save,
    clone,
    normalizeText,
    localDateTime,
    inputDateTime,
    organization,
    position,
    headcount,
    occupants,
    actualQuantity,
    occupancyState,
    lifecycleText,
    occupancyText,
    change,
    planFollowsPosition,
    recalculateLifecycle,
    applyPositionCoefficientChange
  };
}());
