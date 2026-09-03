(function () {
  "use strict";

  const byId = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  let toastTimer = null;

  function showToast(message, type = "success") {
    const toast = byId("toast");
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast show${type === "error" ? " error" : ""}`;
    toastTimer = setTimeout(() => { toast.className = "toast"; }, 2600);
  }

  function openDialog(id) {
    const dialog = byId(id);
    if (dialog && !dialog.open) dialog.showModal();
  }

  function closeDialog(id) {
    const dialog = byId(id);
    if (dialog?.open) dialog.close();
  }

  function downloadBlob(filename, content, type = "application/octet-stream") {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadUpdateWorkbook(filename, options) {
    const escapeXML = value => String(value ?? "").replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]);
    const cell = (value, style = "Data") => `<Cell ss:StyleID="${style}"><Data ss:Type="String">${escapeXML(value)}</Data></Cell>`;
    const columns = options.columns || [];
    const rows = options.rows || [];
    const header = `<Row>${columns.map(column => cell(`${column.label}${column.readonly ? "（不可修改）" : ""}`, column.readonly ? "ReadonlyHeader" : "EditableHeader")).join("")}</Row>`;
    const body = rows.map(row => `<Row>${columns.map(column => cell(typeof column.value === "function" ? column.value(row) : row[column.key])).join("")}</Row>`).join("");
    const instructions = [
      `匹配键：${options.matchKey || "请查看业务说明"}。`,
      "请先导出当前结果，仅修改可编辑列后重新导入。",
      "灰色表头且名称含“不可修改”的列仅供识别和核对。",
      "选填字段留空会清空系统原值；必填字段留空时该行导入失败。",
      "修改不可修改列时该行导入失败，其他校验通过的数据可继续导入。",
      "全部可编辑字段均未变化的记录计为“无变化”并跳过，不计入成功更新。",
      ...(options.instructions || [])
    ];
    const instructionRows = instructions.map((item, index) => `<Row>${cell(index ? item : `【导入更新说明】${item}`, index ? "Data" : "Note")}</Row>`).join("");
    const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="Microsoft YaHei" ss:Size="10"/></Style>
    <Style ss:ID="Data"><Alignment ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#EBEEF5"/></Borders></Style>
    <Style ss:ID="ReadonlyHeader"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Color="#606266"/><Interior ss:Color="#E4E7ED" ss:Pattern="Solid"/></Style>
    <Style ss:ID="EditableHeader"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Color="#1F5F99"/><Interior ss:Color="#ECF5FF" ss:Pattern="Solid"/></Style>
    <Style ss:ID="Note"><Font ss:Bold="1" ss:Color="#1F5F99"/><Interior ss:Color="#ECF5FF" ss:Pattern="Solid"/></Style>
  </Styles>
  <Worksheet ss:Name="${escapeXML(options.sheetName || "导入更新数据")}"><Table>${header}${body}</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>1</SplitHorizontal><TopRowBottomPane>1</TopRowBottomPane></WorksheetOptions></Worksheet>
  <Worksheet ss:Name="导入说明"><Table><Column ss:Width="560"/>${instructionRows}</Table></Worksheet>
</Workbook>`;
    downloadBlob(filename.endsWith(".xls") ? filename : `${filename}.xls`, `\ufeff${xml}`, "application/vnd.ms-excel;charset=utf-8");
  }

  function downloadCreateWorkbook(filename, options) {
    const escapeXML = value => String(value ?? "").replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]);
    const cell = (value, style = "Data") => `<Cell ss:StyleID="${style}"><Data ss:Type="String">${escapeXML(value)}</Data></Cell>`;
    const columns = options.columns || [];
    const header = `<Row>${columns.map(column => cell(`${column.label}${column.required ? "（必填）" : ""}`, column.required ? "RequiredHeader" : "OptionalHeader")).join("")}</Row>`;
    const instructions = [
      "【导入新增说明】本模板只用于新增数据，不会覆盖已有记录。",
      "带“必填”的列必须填写；其他列可按业务需要填写。",
      "文件读取后先执行结构和业务校验，确认导入后才会写入数据。",
      "部分数据校验失败时，其他校验通过的数据仍可继续导入。",
      ...(options.instructions || [])
    ];
    const instructionRows = instructions.map((item, index) => `<Row>${cell(item, index ? "Data" : "Note")}</Row>`).join("");
    const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="Microsoft YaHei" ss:Size="10"/></Style>
    <Style ss:ID="Data"><Alignment ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#EBEEF5"/></Borders></Style>
    <Style ss:ID="RequiredHeader"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Color="#B42318"/><Interior ss:Color="#FEF3F2" ss:Pattern="Solid"/></Style>
    <Style ss:ID="OptionalHeader"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Color="#1F5F99"/><Interior ss:Color="#ECF5FF" ss:Pattern="Solid"/></Style>
    <Style ss:ID="Note"><Font ss:Bold="1" ss:Color="#1F5F99"/><Interior ss:Color="#ECF5FF" ss:Pattern="Solid"/></Style>
  </Styles>
  <Worksheet ss:Name="${escapeXML(options.sheetName || "新增数据")}"><Table>${header}</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>1</SplitHorizontal><TopRowBottomPane>1</TopRowBottomPane></WorksheetOptions></Worksheet>
  <Worksheet ss:Name="填写说明"><Table><Column ss:Width="560"/>${instructionRows}</Table></Worksheet>
</Workbook>`;
    downloadBlob(filename.endsWith(".xls") ? filename : `${filename}.xls`, `\ufeff${xml}`, "application/vnd.ms-excel;charset=utf-8");
  }

  function initShell() {
    const sidebar = byId("sidebar");
    const sidebarToggle = byId("sidebarToggle");
    const compactLayout = window.matchMedia("(max-width: 1279px)");
    const syncSidebarToggle = () => sidebarToggle?.setAttribute("aria-expanded", String(!sidebar?.classList.contains("collapsed")));
    const syncSidebarForViewport = event => {
      sidebar?.classList.toggle("collapsed", event.matches);
      syncSidebarToggle();
    };
    syncSidebarForViewport(compactLayout);
    if (compactLayout.addEventListener) compactLayout.addEventListener("change", syncSidebarForViewport);
    else compactLayout.addListener?.(syncSidebarForViewport);
    sidebarToggle?.addEventListener("click", () => {
      sidebar?.classList.toggle("collapsed");
      syncSidebarToggle();
    });
    document.querySelectorAll(".nav-group-trigger").forEach(button => button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      const items = button.nextElementSibling;
      if (items) items.hidden = expanded;
    }));
    document.addEventListener("click", event => {
      const closeButton = event.target.closest("[data-close]");
      if (closeButton) closeDialog(closeButton.dataset.close);
    });
    document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    }));
  }

  window.PrototypeUI = { byId, escapeHTML, showToast, openDialog, closeDialog, downloadBlob, downloadUpdateWorkbook, downloadCreateWorkbook, initShell };
  document.addEventListener("DOMContentLoaded", initShell, { once: true });
}());
