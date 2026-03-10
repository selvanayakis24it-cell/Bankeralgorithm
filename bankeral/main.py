def print_matrix(name, matrix, processes, resources):
    """Print a matrix in formatted table"""
    print(f"\n{name}")
    print("-" * (len(resources) * 8 + 15))
    print(f"{'Process':<10}", end="")
    for r in resources:
        print(f"{r:<6}", end="")
    print()
    print("-" * (len(resources) * 8 + 15))
    for i, process in enumerate(processes):
        print(f"{process:<10}", end="")
        for j in range(len(resources)):
            print(f"{matrix[i][j]:<6}", end="")
        print()
    print()


def calculate_need_matrix(maximum, allocation):
    """Calculate Need Matrix = Maximum - Allocation"""
    need = []
    for i in range(len(maximum)):
        need_row = []
        for j in range(len(maximum[0])):
            need_row.append(maximum[i][j] - allocation[i][j])
        need.append(need_row)
    return need


def is_safe(allocation, need, available, processes, resources):
    """
    Safety Algorithm (Dijkstra's Algorithm)
    Check if system is in safe state
    Returns: (is_safe, safe_sequence)
    """
    n = len(processes)
    m = len(resources)
    
    # Create copies to avoid modifying originals
    work = available[:]
    finish = [False] * n
    safe_sequence = []
    
    print("\n" + "="*60)
    print("SAFETY ALGORITHM EXECUTION")
    print("="*60)
    
    for step in range(n):
        found = False
        
        for i in range(n):
            if not finish[i]:
                # Check if need[i] <= work
                can_allocate = True
                for j in range(m):
                    if need[i][j] > work[j]:
                        can_allocate = False
                        break
                
                if can_allocate:
                    # Allocate resources
                    print(f"\nStep {step + 1}: Process {processes[i]} can complete")
                    print(f"  Need: {need[i]}")
                    print(f"  Work: {work}")
                    
                    # Free resources
                    for j in range(m):
                        work[j] += allocation[i][j]
                    
                    print(f"  Work After Release: {work}")
                    
                    finish[i] = True
                    safe_sequence.append(processes[i])
                    found = True
                    break
        
        if not found:
            print("\n✗ No process can complete - UNSAFE STATE")
            return False, []
    
    print(f"\n✓ Safe sequence found: {' -> '.join(safe_sequence)}")
    print("✓ SYSTEM IS IN SAFE STATE")
    return True, safe_sequence


def check_safety_silent(allocation, need, available, processes, resources):
    """
    Silent Safety Check - returns boolean without detailed output
    """
    n = len(processes)
    m = len(resources)
    
    work = available[:]
    finish = [False] * n
    
    for step in range(n):
        found = False
        
        for i in range(n):
            if not finish[i]:
                can_allocate = True
                for j in range(m):
                    if need[i][j] > work[j]:
                        can_allocate = False
                        break
                
                if can_allocate:
                    for j in range(m):
                        work[j] += allocation[i][j]
                    
                    finish[i] = True
                    found = True
                    break
        
        if not found:
            return False
    
    return True


def resource_request(pid, request, allocation, need, available, processes, resources):
    """
    Resource Request Algorithm
    Process P_i requests resources
    Returns: (granted, new_state)
    """
    p_idx = processes.index(pid)
    
    print("\n" + "="*60)
    print(f"RESOURCE REQUEST ALGORITHM FOR {pid}")
    print("="*60)
    
    print(f"\nRequest: {request}")
    print(f"Available: {available}")
    
    # Step 1: Check if request <= need
    print(f"\nStep 1: Check if Request ≤ Need")
    for j in range(len(resources)):
        print(f"  {resources[j]}: {request[j]} ≤ {need[p_idx][j]} ? ", end="")
        if request[j] > need[p_idx][j]:
            print("✗ DENIED - Request exceeds need")
            return False, None
        print("✓")
    
    # Step 2: Check if request <= available
    print(f"\nStep 2: Check if Request ≤ Available")
    for j in range(len(resources)):
        print(f"  {resources[j]}: {request[j]} ≤ {available[j]} ? ", end="")
        if request[j] > available[j]:
            print("✗ DENIED - Not enough available resources")
            return False, None
        print("✓")
    
    # Step 3: Pretend to allocate and check safety
    print(f"\nStep 3: Pretend Allocation and Check Safety")
    
    # Create new state
    new_allocation = [row[:] for row in allocation]
    new_need = [row[:] for row in need]
    new_available = available[:]
    
    for j in range(len(resources)):
        new_allocation[p_idx][j] += request[j]
        new_need[p_idx][j] -= request[j]
        new_available[j] -= request[j]
    
    # Check if this state is safe (without detailed output)
    safe = check_safety_silent(new_allocation, new_need, new_available, processes, resources)
    
    if safe:
        print(f"✓ Request GRANTED - Safe state maintained")
        return True, {
            'allocation': new_allocation,
            'need': new_need,
            'available': new_available
        }
    else:
        print(f"✗ Request DENIED - Would lead to unsafe state")
        return False, None


def main() -> None:
    print("\n" + "="*60)
    print("BANKER'S ALGORITHM SIMULATOR")
    print("="*60)
    
    # Input Data
    processes = ['P0', 'P1', 'P2', 'P3', 'P4']
    resources = ['R0', 'R1', 'R2']
    
    # Allocation Matrix
    allocation = [
        [0, 1, 0],
        [3, 0, 2],
        [3, 0, 2],
        [2, 1, 1],
        [0, 0, 2]
    ]
    
    # Maximum Matrix
    maximum = [
        [7, 5, 3],
        [3, 2, 2],
        [9, 0, 2],
        [2, 2, 2],
        [4, 3, 3]
    ]
    
    # Available Resources
    available = [2, 3, 0]
    
    # Calculate Need Matrix
    need = calculate_need_matrix(maximum, allocation)
    
    # Display Initial State
    print_matrix("Allocation Matrix", allocation, processes, resources)
    print_matrix("Maximum Matrix", maximum, processes, resources)
    print_matrix("Need Matrix", need, processes, resources)
    print("Available Resources:", available)
    
    # Check Initial Safety
    initial_safe, initial_sequence = is_safe(allocation, need, available, processes, resources)
    
    # Example Resource Requests
    test_requests = [
        ('P1', [0, 2, 0]),
        ('P3', [0, 1, 0]),
        ('P4', [3, 3, 1]),
    ]
    
    current_allocation = [row[:] for row in allocation]
    current_need = [row[:] for row in need]
    current_available = available[:]
    
    for pid, request in test_requests:
        granted, new_state = resource_request(
            pid, request,
            current_allocation, current_need, current_available,
            processes, resources
        )
        
        if granted:
            current_allocation = new_state['allocation']
            current_need = new_state['need']
            current_available = new_state['available']
            print(f"\n✓ {pid} request approved and allocated")
        else:
            print(f"\n✗ {pid} request denied - not allocated")
        
        print("\n" + "-"*60)


if __name__ == "__main__":
    main()
