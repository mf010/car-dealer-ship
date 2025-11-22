<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام التحديث - Update System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: white;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .header h1 {
            color: #667eea;
            margin-bottom: 10px;
        }

        .version-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .info-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .info-card h3 {
            color: #495057;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .info-card p {
            color: #212529;
            font-size: 16px;
            font-weight: bold;
        }

        .actions-section {
            background: white;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .actions-section h2 {
            color: #495057;
            margin-bottom: 20px;
        }

        .button-group {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-success {
            background: #28a745;
            color: white;
        }

        .btn-info {
            background: #17a2b8;
            color: white;
        }

        .btn-warning {
            background: #ffc107;
            color: #212529;
        }

        .logs-section {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .logs-section h2 {
            color: #495057;
            margin-bottom: 20px;
        }

        .log-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            border-right: 4px solid #17a2b8;
        }

        .log-item h4 {
            color: #495057;
            margin-bottom: 5px;
        }

        .log-item p {
            color: #6c757d;
            font-size: 14px;
        }

        .status-message {
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            display: none;
        }

        .status-message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .status-message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .status-message.info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }

        .loading {
            display: none;
            text-align: center;
            margin: 20px 0;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .backup-info {
            background: #fff3cd;
            padding: 15px;
            border-radius: 8px;
            border-right: 4px solid #ffc107;
            margin-bottom: 20px;
        }

        .backup-info h4 {
            color: #856404;
            margin-bottom: 5px;
        }

        .backup-info p {
            color: #856404;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <h1>🚗 نظام تحديث معرض السيارات</h1>
            <p>Car Dealership Update System</p>
            
            <div class="version-info">
                <div class="info-card">
                    <h3>الإصدار الحالي - Current Version</h3>
                    <p id="current-version">{{ $currentVersion['version'] ?? 'N/A' }}</p>
                </div>
                <div class="info-card">
                    <h3>آخر تحديث - Last Updated</h3>
                    <p id="last-update">{{ $currentVersion['updated_at'] ?? 'N/A' }}</p>
                </div>
                <div class="info-card">
                    <h3>آخر Commit</h3>
                    <p id="last-commit">{{ Str::limit($currentVersion['last_commit'] ?? 'N/A', 30) }}</p>
                </div>
            </div>

            @if($lastBackup)
            <div class="backup-info" style="margin-top: 20px;">
                <h4>📦 آخر نسخة احتياطية</h4>
                <p>{{ $lastBackup['filename'] }} - {{ $lastBackup['date'] }} ({{ $lastBackup['size'] }})</p>
            </div>
            @endif
        </div>

        <!-- Actions Section -->
        <div class="actions-section">
            <h2>⚙️ الإجراءات - Actions</h2>
            
            <div class="button-group">
                <button class="btn btn-primary" onclick="runUpdate()">
                    🔄 تحديث النظام - Run Update
                </button>
                <button class="btn btn-success" onclick="createBackup()">
                    💾 نسخة احتياطية - Create Backup
                </button>
                <button class="btn btn-info" onclick="refreshVersion()">
                    🔍 تحديث معلومات الإصدار - Refresh Version
                </button>
                <button class="btn btn-warning" onclick="viewLogs()">
                    📄 عرض السجلات - View Logs
                </button>
            </div>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>جارٍ المعالجة... Processing...</p>
            </div>

            <div class="status-message" id="status-message"></div>
        </div>

        <!-- Logs Section -->
        <div class="logs-section">
            <h2>📋 سجلات التحديث - Update Logs</h2>
            <div id="logs-container">
                @if(count($updateLogs) > 0)
                    @foreach($updateLogs as $log)
                    <div class="log-item">
                        <h4>{{ $log['filename'] }}</h4>
                        <p>التاريخ: {{ $log['date'] }} | الحجم: {{ $log['size'] }}</p>
                    </div>
                    @endforeach
                @else
                    <div class="log-item">
                        <p>لا توجد سجلات متاحة - No logs available</p>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <script>
        const API_BASE = '/api/system';

        function showMessage(message, type) {
            const messageEl = document.getElementById('status-message');
            messageEl.textContent = message;
            messageEl.className = `status-message ${type}`;
            messageEl.style.display = 'block';
            
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }

        function showLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
        }

        async function runUpdate() {
            if (!confirm('هل أنت متأكد من تحديث النظام؟\nAre you sure you want to update the system?')) {
                return;
            }

            showLoading(true);
            
            try {
                const response = await fetch(`${API_BASE}/update/run`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                
                if (data.success) {
                    showMessage('✅ ' + data.message, 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                } else {
                    showMessage('❌ ' + data.message, 'error');
                }
            } catch (error) {
                showMessage('❌ حدث خطأ: ' + error.message, 'error');
            } finally {
                showLoading(false);
            }
        }

        async function createBackup() {
            showLoading(true);
            
            try {
                const response = await fetch(`${API_BASE}/update/backup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                
                if (data.success) {
                    showMessage('✅ ' + data.message, 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    showMessage('❌ ' + data.message, 'error');
                }
            } catch (error) {
                showMessage('❌ حدث خطأ: ' + error.message, 'error');
            } finally {
                showLoading(false);
            }
        }

        async function refreshVersion() {
            showLoading(true);
            
            try {
                const response = await fetch(`${API_BASE}/update/version`);
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('current-version').textContent = data.version.version;
                    document.getElementById('last-update').textContent = data.version.updated_at;
                    document.getElementById('last-commit').textContent = data.version.last_commit;
                    showMessage('✅ تم تحديث معلومات الإصدار', 'success');
                }
            } catch (error) {
                showMessage('❌ حدث خطأ: ' + error.message, 'error');
            } finally {
                showLoading(false);
            }
        }

        async function viewLogs() {
            showLoading(true);
            
            try {
                const response = await fetch(`${API_BASE}/update/logs?limit=20`);
                const data = await response.json();
                
                if (data.success) {
                    const logsContainer = document.getElementById('logs-container');
                    logsContainer.innerHTML = '';
                    
                    if (data.logs.length > 0) {
                        data.logs.forEach(log => {
                            const logItem = document.createElement('div');
                            logItem.className = 'log-item';
                            logItem.innerHTML = `
                                <h4>${log.filename}</h4>
                                <p>التاريخ: ${log.date} | الحجم: ${log.size}</p>
                            `;
                            logsContainer.appendChild(logItem);
                        });
                    } else {
                        logsContainer.innerHTML = '<div class="log-item"><p>لا توجد سجلات متاحة</p></div>';
                    }
                    
                    showMessage('✅ تم تحديث السجلات', 'info');
                }
            } catch (error) {
                showMessage('❌ حدث خطأ: ' + error.message, 'error');
            } finally {
                showLoading(false);
            }
        }
    </script>
</body>
</html>
