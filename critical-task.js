var critical = critical || {};

critical.Task = function(id, title, x, y, duration, tag, d3Node, config) {
    this.id = id;
    this.title = title;
    this.x = x;
    this.y = y;
    this.duration = duration;
    this.tag = tag;

    config = config || {};
    this.start_date = config.start_date || 0;
    this.early_start = config.early_start || 0,
    this.early_start_date = config.early_start_date || new Date(),
    this.early_finish = config.early_finish || 0,
    this.early_finish_date = config.early_finish_date || new Date(),
    this.late_start = config.late_start || 0,
    this.late_start_date = config.late_start_date || new Date(),
    this.late_finish = config.late_finish || 0,
    this.late_finish_date = config.late_finish_date || new Date(),
    this.effective_finish = config.effective_finish || 0,
    this.effective_finish_date = config.effective_finish_date || null,
    this.error = 0;

    this.predecessors = [];
    this.successors = [];
    this.d3Node = d3Node;
};


critical.Task.load = function(obj) {
    obj = obj || {};
    task = new critical.Task();
    task.id = obj.id;
    task.title = obj.title;
    task.x = obj.x;
    task.y = obj.y;
    task.duration = obj.duration;
    task.tag = obj.tag;
    task.start_date = obj.start_date ? new Date(obj.start_date) : 0;
    task.early_start = obj.early_start || 0,
    task.early_start_date = new Date(obj.early_start_date) || new Date(),
    task.early_finish = obj.early_finish || 0,
    task.early_finish_date = new Date(obj.early_finish_date) || new Date(),
    task.late_start = obj.late_start || 0,
    task.late_start_date = new Date(obj.late_start_date) || new Date(),
    task.late_finish = obj.late_finish || 0,
    task.late_finish_date = new Date(obj.late_finish_date) || new Date(),
    task.effective_finish = obj.effective_finish || 0,
    task.effective_finish_date = obj.effective_finish_date ? new Date(obj.effective_finish_date) : null,
    task.error = obj.error;
    task.predecessors = obj.predecessors || [];
    task.successors = obj.successors || [];
    task.d3Node = obj.d3Node || null;
    return task;
};

critical.Task.prototype.update = function() {
    if (this.predecessors.length > 0) {
        this.early_start = Math.max.apply(Math,this.predecessors.map(function(task){return task.early_finish;}));
    } else {
        this.early_start = 0;
    }

    var old_early_finish = this.early_finish;
    this.early_finish = this.early_start + this.duration;

    if (this.early_finish != old_early_finish) {
        for (var i in this.successors) {
            this.successors[i].update();
        }
    }

    if (this.successors.length > 0) {
        this.late_finish = Math.min.apply(Math,this.successors.map(function(task){return task.late_start;}));
    } else {
        this.late_finish = this.early_finish;
    }

    var old_late_start = this.late_start;
    this.late_start = this.late_finish - this.duration;

    if (this.late_start != old_late_start) {
        for (var i in this.predecessors) {
            this.predecessors[i].update();
        }
    }

    if (this.d3Node) {
        if (this.late_finish == this.early_finish) {
            this.d3Node.classed("critical", true);
        } else {
            this.d3Node.classed("critical", false);
        }
    }
};

critical.Task.prototype.addPredecessor = function(task) {
    this.predecessors.push(task);
};

critical.Task.prototype.addSuccessor = function(task) {
    this.successors.push(task);
};

critical.Task.prototype.setDuration = function(duration) {
    this.duration = duration;
    this.update();
}