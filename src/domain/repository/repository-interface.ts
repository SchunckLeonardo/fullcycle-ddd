export interface RepositoryInterface<T> {
    create(entity: T): Promise<void>
    update(entity: T): Promise<void>
    getById(id: string): Promise<T>
    fetchAll(): Promise<T[]>
}