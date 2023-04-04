import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../Task';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/tasks';

  constructor(private http: HttpClient, private firestore: Firestore) {}

  async updateTask(task: Task): Promise<void> {
    const taskRef = doc(this.firestore, `tasks/${task.id}`);
    return setDoc(taskRef, {
      ...task,
    });
  }

  getTasks(): Observable<Task[]> {
    const taskRef = collection(this.firestore, 'tasks');
    return collectionData(taskRef, { idField: 'id' }) as Observable<Task[]>;
  }

  deleteTask(id: string): Promise<void> {
    const taskRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskRef);
  }

  async updateTaskReminder(id: string): Promise<void>  {
    const taskRef = doc(this.firestore, `tasks/${id}`);
    const docSnap = await getDoc(taskRef);
    let dataToUpdate;
    if (docSnap.exists()) {
      const taskData = docSnap.data();
      const reminderData = taskData['reminder']
      dataToUpdate = { reminder: !reminderData };
    } else {
      console.error("No such document!");
    }
    return updateDoc(taskRef, dataToUpdate);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, httpOptions);
  }
}
