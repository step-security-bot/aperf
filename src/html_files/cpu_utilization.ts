let got_cpu_util_data = false;

function getUtilizationType(run, elem, type, run_data) {
    var cpu_type_datas = [];
    var type_data;
    var cpu;

    var data = JSON.parse(run_data);
    data.forEach(function (value, index, arr) {
        var x_time = [];
        var y_data = [];
        cpu = value.cpu;
        type_data = value.data;
        type_data.forEach(function (i_value, i_index, i_arr) {
            x_time.push(i_value.time.TimeDiff);
            y_data.push(i_value.value);
        });
        var cpu_type_data = {
            name: `CPU ${cpu}`,
            x: x_time,
            y: y_data,
            type: 'scatter',
        };
        cpu_type_datas.push(cpu_type_data);
    });
    var TESTER = elem;
    var layout = {
        title: `CPU Utilization - ${type}`,
        xaxis: {
            title: 'Time (s)',
        },
        yaxis: {
            title: 'CPU Utilization (%)',
            range: [0, 100],
        },
    };
    Plotly.newPlot(TESTER, cpu_type_datas, layout, { frameMargins: 0 });
}
function getUtilizationTypes(run, container_id, keys, run_data) {
    var data = keys;
    data.forEach(function (value, index, arr) {
        if (value != "aggregate") {
            var elem = document.createElement('div');
            elem.style.float = "none";
            addElemToNode(container_id, elem);
            setTimeout(() => {
                getUtilizationType(run, elem, value, run_data[value]);
            }, 0);
        }
    });
}
function getCpuUtilization(elem, run, run_data) {
    var x_time = [];
    var y_user = [];
    var y_nice = [];
    var y_system = [];
    var y_irq = [];
    var y_softirq = [];
    var y_idle = [];
    var y_iowait = [];
    var y_steal = [];

    var data = JSON.parse(run_data);
    data.forEach(function (value, index, arr) {
        x_time.push(value.time.TimeDiff);
        y_user.push(value.values.user);
        y_nice.push(value.values.nice);
        y_system.push(value.values.system);
        y_irq.push(value.values.irq);
        y_softirq.push(value.values.softirq);
        y_idle.push(value.values.idle);
        y_steal.push(value.values.steal);
    });
    var user: Partial<Plotly.PlotData> = {
        name: 'User',
        x: x_time,
        y: y_user,
        type: 'scatter',
    };
    var nice: Partial<Plotly.PlotData> = {
        name: 'Nice',
        x: x_time,
        y: y_nice,
        type: 'scatter',
    };
    var system: Partial<Plotly.PlotData> = {
        name: 'System',
        x: x_time,
        y: y_system,
        type: 'scatter',
    };
    var irq: Partial<Plotly.PlotData> = {
        name: 'IRQ',
        x: x_time,
        y: y_irq,
        type: 'scatter',
    };
    var softirq: Partial<Plotly.PlotData> = {
        name: 'SoftIRQ',
        x: x_time,
        y: y_softirq,
        type: 'scatter',
    };
    var idle: Partial<Plotly.PlotData> = {
        name: 'Idle',
        x: x_time,
        y: y_idle,
        type: 'scatter',
    };
    var iowait: Partial<Plotly.PlotData> = {
        name: 'Iowait',
        x: x_time,
        y: y_iowait,
        type: 'scatter',
    };
    var steal: Partial<Plotly.PlotData> = {
        name: 'Steal',
        x: x_time,
        y: y_steal,
        type: 'scatter',
    };
    var TESTER = elem;
    var layout = {
        title: 'Aggregate CPU Utilization',
        xaxis: {
            title: 'Time (s)',
        },
        yaxis: {
            title: 'CPU Utilization (%)',
            range: [0, 100],
        },
    };
    var data_list = [user, nice, system, irq, softirq, idle, iowait, steal];
    Plotly.newPlot(TESTER, data_list, layout, { frameMargins: 0 });
}
function cpuUtilization() {
    if (got_cpu_util_data) {
        return;
    }
    var data = runs_raw;
    var float_style = "none";
    if (data.length > 1) {
        float_style = "left";
    }
    var run_width = 100 / data.length;
    clearElements('cpu-util-runs');
    data.forEach(function (value, index, arr) {
        // Run div
        var run_div = document.createElement('div');
        let this_run_data;
        run_div.id = `${value}-cpu-util`;
        run_div.style.float = float_style;
        run_div.style.width = `${run_width}%`;
        addElemToNode('cpu-util-runs', run_div);
        var run_node_id = run_div.id;
        //Show aggregate data
        var agg_elem = document.createElement('div');
        agg_elem.id = `${value}-cpu-aggregate`;
        addElemToNode(run_node_id, agg_elem);
        for (let i = 0; i < cpu_utilization_raw_data['runs'].length; i++) {
            if (cpu_utilization_raw_data['runs'][i]['name'] == value) {
                this_run_data = cpu_utilization_raw_data['runs'][i];
                let aggregate_data = this_run_data['key_values']['aggregate'];
                getCpuUtilization(agg_elem, value, aggregate_data);
                //Run name
                var h3_run_per_cpu = document.createElement('h3');
                h3_run_per_cpu.innerHTML = `${value} - Per CPU Stat`;
                h3_run_per_cpu.style.textAlign = "center";
                addElemToNode(run_node_id, h3_run_per_cpu);
                // Show per type data
                var per_type_div = document.createElement('div');
                per_type_div.id = `${value}-cpu-per-type`;
                addElemToNode(run_node_id, per_type_div);
                getUtilizationTypes(value, per_type_div.id, this_run_data['keys'], this_run_data['key_values']);
                break;
            }
        }
    });
    got_cpu_util_data = true;
}
