@extends('admin.layout')

@section('content')

<style>
/* ================= MOBILE RESPONSIVE TABLE (NO SCROLLBAR) ================= */
@media (max-width: 768px) {

    table {
        border: 0;
    }

    table thead {
        display: none;
    }

    table tr {
        display: block;
        margin-bottom: 15px;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 10px;
        background: #fff;
    }

    table td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: none;
        padding: 6px 0;
        font-size: 14px;
    }

    table td::before {
        content: attr(data-label);
        font-weight: 600;
        color: #495057;
    }

    table td:last-child {
        flex-wrap: wrap;
        gap: 6px;
        justify-content: flex-end;
    }
}
</style>

<div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
    <h3 class="mb-0">Food Items</h3>

    <a href="{{ route('admin.foods.create') }}" class="btn btn-success">
        + Add Food
    </a>
</div>

@if(session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif

{{-- 🔍 SEARCH BAR --}}
<div class="mb-3">
    <input type="text"
           id="foodSearch"
           class="form-control"
           placeholder="Search food by name or category...">
</div>

<div class="card">
    <div class="card-body p-0">
        <table class="table table-bordered mb-0" id="foodTable">
            <thead>
                <tr>
                    <th>Sr.No.</th>
                    <th>Food Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th width="25%">Actions</th>
                </tr>
            </thead>

            <tbody>
                @forelse($foods as $food)
                    <tr>
                        <td data-label="#"> {{ $loop->iteration }} </td>

                        <td data-label="Food Name" class="food-name">
                            {{ $food->name }}
                        </td>

                        <td data-label="Category" class="food-category">
                            {{ $food->category->name ?? '-' }}
                        </td>

                        <td data-label="Price">
                            ₹ {{ $food->price }}
                        </td>

                        <td data-label="Type">
                            {{ ucfirst($food->type) }}
                        </td>

                        <td data-label="Status">
                            {{ $food->is_available ? 'Available' : 'Not Available' }}
                        </td>

                        <td data-label="Actions">
                            <a href="{{ route('admin.foods.edit', $food->id) }}"
                               class="btn btn-sm btn-warning">
                                Edit
                            </a>

                            <a href="{{ route('admin.foods.toggle', $food->id) }}"
                               class="btn btn-sm btn-info">
                                {{ $food->is_available ? 'Disable' : 'Enable' }}
                            </a>

                            <form method="POST"
                                  action="{{ route('admin.foods.destroy', $food->id) }}"
                                  style="display:inline;">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-sm btn-danger"
                                        onclick="return confirm('Delete this food?')">
                                    Delete
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center">
                            No food items found
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{-- 🔍 SEARCH SCRIPT --}}
<script>
document.getElementById('foodSearch').addEventListener('keyup', function () {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('#foodTable tbody tr');

    rows.forEach(row => {
        const foodName = row.querySelector('.food-name')?.innerText.toLowerCase() || '';
        const categoryName = row.querySelector('.food-category')?.innerText.toLowerCase() || '';

        row.style.display =
            foodName.includes(searchValue) || categoryName.includes(searchValue)
                ? ''
                : 'none';
    });
});
</script>

@endsection
