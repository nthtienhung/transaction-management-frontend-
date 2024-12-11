import React, { useState, useEffect } from 'react';
import * as ConfigAPI from '../api/configService';
import './ConfigService.css';

const ConfigService = () => {
  const [configs, setConfigs] = useState([]);
  const [newConfig, setNewConfig] = useState({
    group: '',
    type: '',
    configKey: '',
    configValue: '',
    status: 'ACTIVE',
  });
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [filterGroup, setFilterGroup] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterConfigKey, setFilterConfigKey] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 5; // Kích thước trang cố định

  useEffect(() => {
    fetchConfigs();
  }, [filterGroup, filterType, filterConfigKey, filterStatus, page]);

  const fetchConfigs = async () => {
    try {
      const response = await ConfigAPI.getConfigs(
        filterGroup,
        // "USER",
        filterType,
        filterConfigKey,
        filterStatus,
        { page, size: pageSize }
      );
      const { content, totalElements } = response.data.data;
      console.log(response)
      console.log(page)

      setConfigs(content);
      setTotalPages(Math.ceil(totalElements / pageSize)); // Tính toán số trang
    } catch (error) {
      console.error('Error fetching configs:', error);
    }
  };

  const handleAddConfigClick = () => {
    setShowModal(true);
    setIsUpdate(false);
    setNewConfig({
      group: '',
      type: '',
      configKey: '',
      configValue: '',
      status: 'ACTIVE',
    });
  };

  const handleUpdateConfigClick = (config) => {
    setShowModal(true);
    setIsUpdate(true);
    setNewConfig(config);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleAddOrUpdateConfig = async () => {
    try {
      if (isUpdate) {
        await ConfigAPI.updateConfig(newConfig.configID, newConfig);
      } else {
        await ConfigAPI.addConfig(newConfig);
      }
      setNewConfig({
        group: '',
        type: '',
        configKey: '',
        configValue: '',
        status: 'ACTIVE',
      });
      setShowModal(false);
      fetchConfigs();
    } catch (error) {
      console.error('Error adding/updating config:', error);
    }
  };

  const handleFilterChange = async () => {
    setPage(0); // Reset về trang đầu tiên
    await fetchConfigs();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div className="config-header">
        <h2>Config Service</h2>
      </div>
      <div>
        <button className="add-button" onClick={handleAddConfigClick}>Add Config</button>
        <div className="filter-container">
          <label>
            Group:
            <input
              type="text"
              value={filterGroup}
              onChange={(e) => {
                setFilterGroup(e.target.value);
                handleFilterChange();
              }}
            />
          </label>
          <label>
            Type:
            <input
              type="text"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                handleFilterChange();
              }}
            />
          </label>
          <label>
            Config Key:
            <input
              type="text"
              value={filterConfigKey}
              onChange={(e) => {
                setFilterConfigKey(e.target.value);
                handleFilterChange();
              }}
            />
          </label>
          <label>
            Status:
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                handleFilterChange();
              }}
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
          <button onClick={fetchConfigs}>Apply Filters</button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isUpdate ? 'Update Config' : 'Add Config'}</h3>
            <div>
              <label>
                Group:
                <input
                  type="text"
                  value={newConfig.group}
                  onChange={(e) => setNewConfig({ ...newConfig, group: e.target.value })}
                />
              </label>
            </div>
            <div>
              <label>
                Type:
                <input
                  type="text"
                  value={newConfig.type}
                  onChange={(e) => setNewConfig({ ...newConfig, type: e.target.value })}
                />
              </label>
            </div>
            <div>
              <label>
                Config Key:
                <input
                  type="text"
                  value={newConfig.configKey}
                  onChange={(e) => setNewConfig({ ...newConfig, configKey: e.target.value })}
                />
              </label>
            </div>
            <div>
              <label>
                Config Value:
                <input
                  type="text"
                  value={newConfig.configValue}
                  onChange={(e) => setNewConfig({ ...newConfig, configValue: e.target.value })}
                />
              </label>
            </div>
            <div>
              <label>
                Status:
                <select
                  value={newConfig.status}
                  onChange={(e) => setNewConfig({ ...newConfig, status: e.target.value })}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>
            </div>
            <div>
              <button onClick={handleAddOrUpdateConfig}>
                {isUpdate ? 'Update' : 'Add'}
              </button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3>Existing Configs</h3>
        <table>
          <thead>
            <tr>
              <th>Group</th>
              <th>Type</th>
              <th>Config Key</th>
              <th>Config Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((config) => (
              <tr key={config.configID}>
                <td>{config.group}</td>
                <td>{config.type}</td>
                <td>{config.configKey}</td>
                <td>{config.configValue}</td>
                <td>{config.status}</td>
                <td>
                  <button onClick={() => handleUpdateConfigClick(config)}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {totalPages > 1 &&
          Array.from({ length: totalPages }, (_, index) => index).map((pageIndex) => (
            <button
              key={pageIndex}
              className={page === pageIndex ? 'active' : ''}
              onClick={() => handlePageChange(pageIndex)}
            >
              {pageIndex + 1}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ConfigService;
