export const MockRepository = (T?: any) => {
    return {
        update: jest.fn(),
        create: jest.fn(),
        getById: jest.fn().mockReturnValue(Promise.resolve(T)),
        fetchAll: jest.fn().mockReturnValue(Promise.resolve(T instanceof Array ? [...T] : [T])),
    }
}