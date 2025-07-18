def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    #find middle value, define rhs and lhs
    middle = len(arr) // 2
    left_side = arr[:middle]
    right_side = arr[middle:]

    left_side = merge_sort(left_side)
    right_side = merge_sort(right_side)

    return merge(left_side, right_side)

def merge(left_side, right_side):
    merged_list = []
    i = 0
    j = 0

    
    while i < len(left_side) and j < len(right_side):
        if left_side[i] <= right_side[j]:
            merged_list.append(left_side[i])
            i += 1
        else:
            merged_list.append(right_side[j])
            j += 1

    while i < len(left_side):
        merged_list.append(left_side[i])
        i += 1

    while j < len(right_side):
        merged_list.append(right_side[j])
        j += 1

    return merged_list

def main():
    list1 = [38, 27, 43, 3, 9, 82, 10]
    print(f"Original List 1: {list1}")
    sorted_list1 = merge_sort(list1)
    print(f"Sorted List 1: {sorted_list1}\n")

    list2 = [5, 2, 8, 1, 9, 4]
    print(f"Original List 2: {list2}")
    sorted_list2 = merge_sort(list2)
    print(f"Sorted List 2: {sorted_list2}\n")

    list3 = [1]
    print(f"Original List 3: {list3}")
    sorted_list3 = merge_sort(list3)
    print(f"Sorted List 3: {sorted_list3}\n")

    list4 = []
    print(f"Original List 4: {list4}")
    sorted_list4 = merge_sort(list4)
    print(f"Sorted List 4: {sorted_list4}\n")

    list5 = [7, 7, 7, 1, 1, 1]
    print(f"Original List 5: {list5}")
    sorted_list5 = merge_sort(list5)
    print(f"Sorted List 5: {sorted_list5}\n")


if __name__ == "__main__":
    main()