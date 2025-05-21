export class Task {
    constructor(id, subject, description, startDate, dueDate, project) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.project = project;
    }
}