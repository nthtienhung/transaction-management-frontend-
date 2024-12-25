import React, { useEffect, useState, useCallback } from "react";
import { Button, message, Card, Col, Row, Radio } from "antd";
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import { Column, Pie } from '@ant-design/charts';
import { writeFileXLSX, utils } from 'xlsx';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField } from '@mui/material';
import './style/AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedChart, setSelectedChart] = useState("column");
  const [dateRange, setDateRange] = useState([moment().startOf("day"), moment().endOf("day")]);
  const [generalReport, setGeneralReport] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('day');
  const [columnChartData, setColumnChartData] = useState([]);
  const [chartWidth, setChartWidth] = useState(800);
  const [searchText, setSearchText] = useState("");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      let startDate, endDate;

      // Xác định khoảng thời gian theo filter type
      if (filterType === 'day') {
        startDate = moment().startOf("day").toISOString();
        endDate = moment().endOf("day").toISOString();
        setChartWidth(300);
      } else if (filterType === 'week') {
        startDate = moment().startOf("week").toISOString();
        endDate = moment().endOf("week").toISOString();
        setChartWidth(600);
      } else if (filterType === 'month') {
        startDate = moment().startOf("month").toISOString();
        endDate = moment().endOf("month").toISOString();
        setChartWidth(600);
      } else if (filterType === 'custom' && dateRange) {
        startDate = dateRange[0].toISOString();
        endDate = dateRange[1].toISOString();
        const days = moment(endDate).diff(moment(startDate), 'days') + 1;
        setChartWidth(600);
      }

      // Lấy dữ liệu từ API
      const generalResponse = await axios.get(
          "http://localhost:8888/api/v1/transaction/general",
          {
            params: { startDate, endDate },
            headers: { Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}` },
          }
      ).catch((error =>{
        axios
            .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
              headers: {
                Authorization: `${sessionStorage.getItem(
                    "its-cms-refreshToken"
                )}`,
              },
            })
            .then((res) => {
              Cookies.remove("its-cms-accessToken");
              sessionStorage.removeItem("its-cms-refreshToken");
              Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
              sessionStorage.setItem(
                  "its-cms-refreshToken",
                  res.data.data.refreshToken
              );
              window.location.reload()
            });
      }));

      const userResponse = await axios.get(
          "http://localhost:8888/api/v1/transaction/users",
          {
            params: { startDate, endDate },
            headers: { Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}` },
          }
      ).catch((error =>{
        axios
            .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
              headers: {
                Authorization: `${sessionStorage.getItem(
                    "its-cms-refreshToken"
                )}`,
              },
            })
            .then((res) => {
              Cookies.remove("its-cms-accessToken");
              sessionStorage.removeItem("its-cms-refreshToken");
              Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
              sessionStorage.setItem(
                  "its-cms-refreshToken",
                  res.data.data.refreshToken
              );
            });
      }));

      const transactionResponse = await axios.get(
          "http://localhost:8888/api/v1/transaction/transactions",
          {
            params: { startDate, endDate },
            headers: { Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}` },
          }
      ).catch((error =>{
        axios
            .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
              headers: {
                Authorization: `${sessionStorage.getItem(
                    "its-cms-refreshToken"
                )}`,
              },
            })
            .then((res) => {
              Cookies.remove("its-cms-accessToken");
              sessionStorage.removeItem("its-cms-refreshToken");
              Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
              sessionStorage.setItem(
                  "its-cms-refreshToken",
                  res.data.data.refreshToken
              );
            });
      }));

      setGeneralReport(generalResponse.data);
      setUserReports(userResponse.data);
      setTransactionDetails(transactionResponse.data);

      // Tổng hợp dữ liệu theo ngày và status
      const allDates = [];
      const start = moment(startDate);
      const end = moment(endDate);
      for (let m = start; m.isBefore(end); m.add(1, 'days')) {
        allDates.push(m.format('YYYY-MM-DD'));
      }

      const groupedData = allDates.map((date) => {
        // Lọc các giao dịch theo ngày
        const transactionsOnDate = transactionResponse.data.filter((item) =>
            moment(item.date).format('YYYY-MM-DD') === date
        );

        // Tổng hợp số tiền theo status
        const statusTotals = transactionsOnDate.reduce((acc, transaction) => {
          acc[transaction.status] = (acc[transaction.status] || 0) + transaction.amount;
          return acc;
        }, {});

        return {
          date: date,
          ...statusTotals, // Mỗi status sẽ có số tiền riêng
        };
      });

      // Chuyển đổi dữ liệu cho biểu đồ
      const chartData = [];
      groupedData.forEach((item) => {
        Object.keys(item).forEach((status) => {
          if (status !== "date") {
            chartData.push({
              date: item.date,
              status: status,
              amount: item[status],
            });
          }
        });
      });

      setColumnChartData(chartData);
    } catch (error) {
      message.error("Lỗi khi lấy dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  }, [filterType, dateRange]);

  useEffect(() => {
    fetchReports();
  }, [filterType, dateRange]);

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const filteredTransactions = transactionDetails.filter(transaction =>
      transaction.transactionCode.includes(searchText) ||
      transaction.senderWalletCode.includes(searchText) ||
      transaction.recipientWalletCode.includes(searchText)
  );

  const exportToExcel = () => {
    const data = filteredTransactions.map((transaction) => ({
      "Transaction Code": transaction.transactionCode,
      Amount: transaction.amount.toLocaleString("en-US", { style: "currency", currency: "VND" }),
      "Sender Wallet": transaction.senderWalletCode,
      "Recipient Wallet": transaction.recipientWalletCode,
      Status: transaction.status,
      "Created Date": moment(transaction.date).format("YYYY-MM-DD HH:mm:ss"),
    }));

    const ws = utils.json_to_sheet(data);

    const getMaxColumnWidth = (data, header) => {
      return Math.max(
          header.length,
          ...data.map((row) => (row[header] ? row[header].toString().length : 0))
      );
    };

    const headers = Object.keys(data[0] || {});
    const columnWidths = headers.map((header) => ({
      wch: Math.max(getMaxColumnWidth(data, header) + 2, 2),
    }));

    const title = [["Transaction Report"]];
    const subtitle = [[`Generated on: ${moment().format("YYYY-MM-DD HH:mm:ss")}`]];

    const titleWs = utils.aoa_to_sheet(title);
    utils.sheet_add_aoa(titleWs, subtitle, { origin: "A2" });
    utils.sheet_add_json(titleWs, data, { origin: "A4" });

    titleWs["A1"].s = { font: { bold: true, sz: 16, color: { rgb: "0070C0" } } };
    titleWs["A2"].s = { font: { italic: true, sz: 12, color: { rgb: "808080" } } };

    titleWs["!cols"] = columnWidths;

    const wb = utils.book_new();
    utils.book_append_sheet(wb, titleWs, "Transactions");

    writeFileXLSX(wb, "Transactions_Report.xlsx");
  };

  const statusCounts = transactionDetails.reduce((acc, transaction) => {
    acc[transaction.status] = (acc[transaction.status] || 0) + 1;
    return acc;
  }, {});

  const pieConfig = {
    appendPadding: 10,
    data: Object.entries(statusCounts).map(([status, count]) => ({
      type: status,
      value: count,
    })),
    angleField: 'value',
    colorField: 'type',
  };

  const columnChartConfig = {
    data: columnChartData,
    xField: 'date',
    yField: 'amount',
    seriesField: 'status',  // Phân biệt các series theo status
    colorField: 'status',  // Áp dụng màu sắc dựa trên `status`
    color: (status) => {
      // Tạo bảng màu cho các status
      const colorMap = {
        "SUCCESS": "#4CAF50",
        "FAILED": "#e81505",
        "PENDING": "#FF9800",
      };
      return colorMap[status] || "#000000";  // Mặc định màu đen nếu không có trong bảng
    },
    width: chartWidth - 100,
    height: 400,
    minWidth: 0,
    scrollbar: {
      type: 'horizontal',
    },
  };

  return (
      <div className="dashboard-container">
        <h1 className="title">Admin Transaction Dashboard</h1>

        <Card className="filter-card">
          <Row gutter={20} align="middle">
            <Col>
              <Radio.Group value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <Radio.Button value="day">Day</Radio.Button>
                <Radio.Button value="week">Week</Radio.Button>
                <Radio.Button value="month">Month</Radio.Button>
                <Radio.Button value="custom">Custom</Radio.Button>
              </Radio.Group>
            </Col>

            {filterType === 'custom' && (
                <Col>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateRangePicker
                        startText="Start"
                        endText="End"
                        value={dateRange}
                        onChange={handleDateChange}
                        renderInput={(startProps, endProps) => (
                            <>
                              <TextField {...startProps} variant="standard" />
                              <TextField {...endProps} variant="standard" />
                            </>
                        )}
                    />
                  </LocalizationProvider>
                </Col>
            )}

            <Col>
              <Button type="primary" onClick={fetchReports} loading={loading}>Apply Filters</Button>
              <Button type="primary" onClick={exportToExcel}>Export to Excel</Button>
            </Col>
          </Row>
        </Card>

        {/* Chart Type Switcher */}
        <Card className="chart-switcher">
          <Radio.Group value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
            <Radio.Button value="column">Column Chart</Radio.Button>
            <Radio.Button value="pie">Pie Chart</Radio.Button>
          </Radio.Group>
        </Card>

        {/* Selected Chart and Reports */}
        <Row gutter={20}>
          <Col span={16}>
            {selectedChart === "column" && (
                <Card className="chart-container">
                  <Column {...columnChartConfig} />
                </Card>
            )}

            {selectedChart === "pie" && (
                <Card className="chart-container">
                  <Pie {...pieConfig} />
                </Card>
            )}
          </Col>

          <Col span={8}>
            {/* General Report */}
            <Card className="report-card">
              <h3>General Report</h3>
              <p>Total Transactions: {generalReport?.totalTransactions}</p>
              <p>Total Amount: {generalReport?.totalAmount} đ</p>
            </Card>

            {/* User Reports */}
            <Card className="report-card">
              <h3>User Reports</h3>
              {userReports.map((report, index) => (
                  <div key={index}>
                    <p>Sender Wallet {report.senderWallet}: {report.totalAmount} đ</p>
                  </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
  );
};

export default AdminDashboard;
