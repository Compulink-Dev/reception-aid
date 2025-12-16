# Reception Aid API Documentation

This document provides a comprehensive overview of all CRUD APIs available in the Reception Aid application.

## Base URL
All APIs are accessible at: `http://localhost:3000/api`

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "pagination": {
    "totalDocs": 100,
    "totalPages": 10,
    "page": 1,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Authentication APIs

### Login
- **POST** `/api/users/login`
- **Body**: `{ email, password }`
- **Response**: User data with authentication token and cookies set

### Get Current User
- **GET** `/api/users/me`
- **Headers**: Requires `payload-token` cookie
- **Response**: Current authenticated user data

## Dashboard APIs

### Get Dashboard Statistics
- **GET** `/api/dashboard/stats`
- **Response**: Real-time statistics for all modules

### Get Recent Activities
- **GET** `/api/dashboard/activities`
- **Response**: Recent activities from all collections (max 15)

## Visitors API

### List Visitors
- **GET** `/api/visitors`
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by status (checked-in, checked-out, expected)
  - `search`: Search by name, company, or phone
  - `dateFrom`: Filter from date (ISO format)
  - `dateTo`: Filter to date (ISO format)

### Create Visitor
- **POST** `/api/visitors`
- **Body**: `{ name, phone, email, company, purpose, employeeToMeet, status, notes, badgeNumber }`

### Get Single Visitor
- **GET** `/api/visitors/[id]`

### Update Visitor
- **PATCH** `/api/visitors/[id]`
- **Body**: Partial visitor data

### Delete Visitor
- **DELETE** `/api/visitors/[id]`

## Parcels API

### List Parcels
- **GET** `/api/parcels`
- **Query Params**:
  - `page`, `limit`: Pagination
  - `status`: Filter by status (received, collected, returned)
  - `search`: Search by sender, description, or tracking number
  - `dateFrom`, `dateTo`: Date range filter

### Create Parcel
- **POST** `/api/parcels`
- **Body**: `{ sender, senderType, recipient, description, trackingNumber, status }`

### Get Single Parcel
- **GET** `/api/parcels/[id]`

### Update Parcel
- **PATCH** `/api/parcels/[id]`

### Delete Parcel
- **DELETE** `/api/parcels/[id]`

## Phone Calls API

### List Phone Calls
- **GET** `/api/phone-calls`
- **Query Params**:
  - `page`, `limit`: Pagination
  - `search`: Search by caller name, number, or purpose
  - `dateFrom`, `dateTo`: Date range filter

### Create Phone Call
- **POST** `/api/phone-calls`
- **Body**: `{ employee, callerName, callerNumber, purpose, startTime, endTime, duration, cost }`

### Get Single Phone Call
- **GET** `/api/phone-calls/[id]`

### Update Phone Call
- **PATCH** `/api/phone-calls/[id]`

### Delete Phone Call
- **DELETE** `/api/phone-calls/[id]`

## Travel Logs API

### List Travel Logs
- **GET** `/api/travel-logs`
- **Query Params**:
  - `page`, `limit`: Pagination
  - `status`: Filter by status (departed, returned, delayed)
  - `search`: Search by destination or purpose
  - `dateFrom`, `dateTo`: Date range filter

### Create Travel Log
- **POST** `/api/travel-logs`
- **Body**: `{ employee, destination, purpose, departureTime, expectedReturn, actualReturn, status }`

### Get Single Travel Log
- **GET** `/api/travel-logs/[id]`

### Update Travel Log
- **PATCH** `/api/travel-logs/[id]`

### Delete Travel Log
- **DELETE** `/api/travel-logs/[id]`

## Vehicles API

### List Vehicles
- **GET** `/api/vehicles`
- **Query Params**:
  - `page`, `limit`: Pagination
  - `vehicleType`: Filter by type (company-car, employee-personal, visitor, delivery)
  - `search`: Search by registration number or owner name
  - `status`: Filter by parking status (parked/exited)

### Create Vehicle
- **POST** `/api/vehicles`
- **Body**: `{ registrationNumber, vehicleType, ownerName, ownerPhone, purpose, entryTime, exitTime, currentMileage, notes }`

### Get Single Vehicle
- **GET** `/api/vehicles/[id]`

### Update Vehicle
- **PATCH** `/api/vehicles/[id]`

### Delete Vehicle
- **DELETE** `/api/vehicles/[id]`

## Employees API

### List Employees
- **GET** `/api/employees`
- **Query Params**:
  - `page`, `limit`: Pagination (default: 50 per page)
  - `department`: Filter by department (it, hr, finance, operations, sales)
  - `isActive`: Filter by active status (true/false)
  - `search`: Search by name, email, or employee ID

### Create Employee
- **POST** `/api/employees`
- **Body**: `{ name, employeeId, department, email, phone, isActive }`

### Get Single Employee
- **GET** `/api/employees/[id]`

### Update Employee
- **PATCH** `/api/employees/[id]`

### Delete Employee
- **DELETE** `/api/employees/[id]`

## Clients API

### List Clients
- **GET** `/api/clients`
- **Query Params**:
  - `page`, `limit`: Pagination (default: 20 per page)
  - `status`: Filter by status (active, inactive, prospect)
  - `industry`: Filter by industry (technology, finance, healthcare, retail, manufacturing, other)
  - `search`: Search by company name, contact person, or email

### Create Client
- **POST** `/api/clients`
- **Body**: `{ companyName, contactPerson, email, phone, address, city, country, industry, clientSince, status, notes, assignedEmployee }`

### Get Single Client
- **GET** `/api/clients/[id]`

### Update Client
- **PATCH** `/api/clients/[id]`

### Delete Client
- **DELETE** `/api/clients/[id]`

## Usage Examples

### Fetching Visitors with Filters
```javascript
const response = await fetch('/api/visitors?page=1&limit=10&status=checked-in&search=John')
const { success, data, pagination } = await response.json()
```

### Creating a New Visitor
```javascript
const response = await fetch('/api/visitors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    phone: '+1234567890',
    company: 'Acme Corp',
    purpose: 'Business meeting',
    status: 'checked-in'
  })
})
const { success, data, message } = await response.json()
```

### Updating a Resource
```javascript
const response = await fetch(`/api/visitors/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'checked-out',
    checkOutTime: new Date().toISOString()
  })
})
```

### Fetching with Date Range
```javascript
const dateFrom = '2025-01-01'
const dateTo = '2025-01-31'
const response = await fetch(`/api/travel-logs?dateFrom=${dateFrom}&dateTo=${dateTo}`)
```

## Notes

- All dates should be in ISO 8601 format
- Pagination is available on all list endpoints
- Search parameters perform partial/contains matching
- All relationship fields are populated with `depth: 1` by default
- DELETE operations are permanent and cannot be undone
- Authentication is required for all endpoints (except login)
