

class Task:

    def __init__(self, id, name, duration):
        self.id = id
        self.name = name
        self.predecessors = {}
        self.successors = {}
        self.duration = duration
        self.early_start = 0
        self.early_finish = 0
        self.late_start = 0
        self.late_finish = 0

    def update(self, task_caller=None):

        if len(self.predecessors):
            self.early_start = max(self.predecessors.values(), lambda predecessor: predecessor.early_finish)
        else:
            self.early_start = 0

        old_early_finish = self.early_finish
        self.early_finish = self.early_start + self.duration

        if self.early_finish != old_early_finish:
            for successor in self.successors.values():
                successor.update()

        if len(self.successors):
            self.late_finish = min(self.successors.values(), lambda successor: successor.late_start)
        else:
            self.late_finish = self.early_finish

        old_late_start = self.late_start
        self.late_start = self.late_finish - self.duration

        if self.late_start != old_late_start:
            for predecessor in self.predecessors.values():
                predecessor.update()

    def addPredecessor(self, task):
        if task.id not in self.predecessors:
            self.predecessors[task.id] = task
            task.successors[self.id] = self
            self.update()

    def delPredecessor(self, task):
        if task.id in self.predecessors:
            del self.predecessors[task.id]
            del task.successors[self.id]
            task.update()
            self.update()

    def setDuration(self, duration):
        self.duration = duration
        self.update()
