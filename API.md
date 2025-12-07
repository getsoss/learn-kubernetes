# Proxy Server API 명세서

## 개요

이 API는 특정 세션의 Kubernetes 리소스(Pods, Nodes)를 조회하는 기능을 제공합니다.

**Base URL**: `http://localhost:8000` (또는 설정된 서버 주소)

## 인증

모든 API 요청에는 인증 토큰이 필요합니다.

### 인증 방식

```
Authorization: Bearer {access_token}
```

- `access_token`: Supabase에서 발급한 JWT 토큰

### 인증 실패 시

- **401 Unauthorized**: 토큰이 없거나 유효하지 않은 경우

---

## API 엔드포인트

### 1. 세션의 Pods 조회

특정 세션에 연결된 Kubernetes 클러스터의 모든 Pods를 조회합니다.

#### 요청

```http
GET /session/{session_id}/pods
Authorization: Bearer {access_token}
```

#### 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `session_id` | string | Yes | 조회할 세션 ID |

#### 헤더

| 헤더 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `Authorization` | string | Yes | `Bearer {access_token}` 형식 |

#### 응답

**200 OK** - 성공

```json
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "12345"
  },
  "items": [
    {
      "metadata": {
        "name": "nginx-pod",
        "namespace": "default",
        "uid": "123e4567-e89b-12d3-a456-426614174000"
      },
      "spec": {
        "containers": [
          {
            "name": "nginx",
            "image": "nginx:latest"
          }
        ]
      },
      "status": {
        "phase": "Running",
        "podIP": "10.244.1.5"
      }
    }
  ]
}
```

**에러 응답**

| 상태 코드 | 설명 | 응답 예시 |
|----------|------|----------|
| 401 | 인증 실패 | `{"detail": "Invalid token"}` |
| 403 | 권한 없음 | `{"detail": "Not authorised for this session"}` |
| 404 | 세션을 찾을 수 없음 | `{"detail": "Session not found"}` |
| 500 | 내부 서버 오류 | `{"detail": "Internal server error"}` |
| 502 | k8s-api-server 연결 실패 | `{"detail": "Failed to reach k8s-api-server"}` |

#### 예시

**cURL**

```bash
curl -X GET \
  http://localhost:8000/session/session-12345/pods \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (fetch)**

```javascript
const response = await fetch('http://localhost:8000/session/session-12345/pods', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});

const data = await response.json();
console.log(data);
```

**Python (requests)**

```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
}

response = requests.get(
    'http://localhost:8000/session/session-12345/pods',
    headers=headers
)

pods = response.json()
print(pods)
```

---

### 2. 세션의 Nodes 조회

특정 세션에 연결된 Kubernetes 클러스터의 모든 Nodes를 조회합니다.

#### 요청

```http
GET /session/{session_id}/nodes
Authorization: Bearer {access_token}
```

#### 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `session_id` | string | Yes | 조회할 세션 ID |

#### 헤더

| 헤더 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `Authorization` | string | Yes | `Bearer {access_token}` 형식 |

#### 응답

**200 OK** - 성공

```json
{
  "kind": "NodeList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "12345"
  },
  "items": [
    {
      "metadata": {
        "name": "node-1",
        "uid": "123e4567-e89b-12d3-a456-426614174000"
      },
      "spec": {},
      "status": {
        "conditions": [
          {
            "type": "Ready",
            "status": "True"
          }
        ],
        "addresses": [
          {
            "type": "InternalIP",
            "address": "10.0.0.1"
          }
        ]
      }
    }
  ]
}
```

**에러 응답**

| 상태 코드 | 설명 | 응답 예시 |
|----------|------|----------|
| 401 | 인증 실패 | `{"detail": "Invalid token"}` |
| 403 | 권한 없음 | `{"detail": "Not authorised for this session"}` |
| 404 | 세션을 찾을 수 없음 | `{"detail": "Session not found"}` |
| 500 | 내부 서버 오류 | `{"detail": "Internal server error"}` |
| 502 | k8s-api-server 연결 실패 | `{"detail": "Failed to reach k8s-api-server"}` |

#### 예시

**cURL**

```bash
curl -X GET \
  http://localhost:8000/session/session-12345/nodes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (fetch)**

```javascript
const response = await fetch('http://localhost:8000/session/session-12345/nodes', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});

const data = await response.json();
console.log(data);
```

**Python (requests)**

```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
}

response = requests.get(
    'http://localhost:8000/session/session-12345/nodes',
    headers=headers
)

nodes = response.json()
print(nodes)
```

---

## 데이터 모델

### PodList

Kubernetes PodList 리소스입니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| `kind` | string | 리소스 타입 (`"PodList"`) |
| `apiVersion` | string | API 버전 (`"v1"`) |
| `metadata` | object | 메타데이터 |
| `items` | array | Pod 객체 배열 |

### Pod

Kubernetes Pod 리소스입니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| `metadata` | object | Pod 메타데이터 (name, namespace, uid 등) |
| `spec` | object | Pod 스펙 (containers 등) |
| `status` | object | Pod 상태 (phase, podIP 등) |

### NodeList

Kubernetes NodeList 리소스입니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| `kind` | string | 리소스 타입 (`"NodeList"`) |
| `apiVersion` | string | API 버전 (`"v1"`) |
| `metadata` | object | 메타데이터 |
| `items` | array | Node 객체 배열 |

### Node

Kubernetes Node 리소스입니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| `metadata` | object | Node 메타데이터 (name, uid 등) |
| `spec` | object | Node 스펙 |
| `status` | object | Node 상태 (conditions, addresses 등) |

### Error

에러 응답 모델입니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| `detail` | string | 에러 메시지 |

---

## 주의사항

1. **인증 토큰**: 모든 요청에 유효한 Bearer 토큰이 필요합니다.
2. **세션 권한**: 요청한 사용자는 해당 세션의 소유자여야 합니다.
3. **세션 존재**: 세션이 존재하지 않거나 만료된 경우 404 에러가 반환됩니다.
4. **k8s-api-server 연결**: VM의 k8s-api-server에 연결할 수 없는 경우 502 에러가 반환됩니다.
5. **응답 형식**: 응답은 Kubernetes API의 표준 형식을 따릅니다.

---

## 관련 문서

- [Kubernetes API 문서](https://kubernetes.io/docs/reference/kubernetes-api/)
- [FastAPI 문서](https://fastapi.tiangolo.com/)

