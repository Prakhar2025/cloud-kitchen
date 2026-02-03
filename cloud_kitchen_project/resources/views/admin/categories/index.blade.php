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

<h3 class="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
    Category Management

    <button class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addCategoryModal">
        ➕ Add Category
    </button>
</h3>

@if(session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif

{{-- 🔍 SEARCH BAR --}}
<div class="mb-3">
    <input type="text"
           id="categorySearch"
           class="form-control"
           placeholder="Search category by name...">
</div>

{{-- ================= ADD CATEGORY MODAL ================= --}}
<div class="modal fade" id="addCategoryModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Add Category</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form method="POST"
                  action="{{ route('admin.categories.store') }}"
                  enctype="multipart/form-data">
                @csrf

                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Category Name</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Category Image</label>
                        <input type="file" name="image" class="form-control">
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary">Save Category</button>
                </div>
            </form>

        </div>
    </div>
</div>

<div class="card">
    <div class="card-header">Category List</div>

    <div class="card-body p-0">
        <table class="table table-bordered mb-0" id="categoryTable">
            <thead>
                <tr>
                    <th>Sr.No.</th>
                    <th>Category Name</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th width="30%">Actions</th>
                </tr>
            </thead>

            <tbody>
                @foreach($categories as $cat)
                    <tr>
                        <td data-label="Sr.No.">{{ $loop->iteration }}</td>

                        <td data-label="Category" class="category-name">
                            {{ $cat->name }}
                        </td>

                        <td data-label="Image">
                            @if($cat->image)
                                <img src="{{ asset('uploads/categories/'.$cat->image) }}"
                                     width="60" class="rounded">
                            @else
                                —
                            @endif
                        </td>

                        <td data-label="Status">
                            <span class="badge {{ $cat->status ? 'bg-success' : 'bg-secondary' }}">
                                {{ $cat->status ? 'Active' : 'Inactive' }}
                            </span>
                        </td>

                        <td data-label="Actions">
                            <button class="btn btn-sm btn-warning"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editCategoryModal{{ $cat->id }}">
                                Edit
                            </button>

                            <a href="{{ route('admin.categories.toggle', $cat->id) }}"
                               class="btn btn-sm btn-info">
                                {{ $cat->status ? 'Deactivate' : 'Activate' }}
                            </a>

                            <form method="POST"
                                  action="{{ route('admin.categories.destroy', $cat->id) }}"
                                  style="display:inline;">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-sm btn-danger"
                                        onclick="return confirm('Delete this category?')">
                                    Delete
                                </button>
                            </form>
                        </td>
                    </tr>

                    {{-- EDIT MODAL (UNCHANGED) --}}
                    <div class="modal fade" id="editCategoryModal{{ $cat->id }}" tabindex="-1">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Edit Category</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>

                                <form method="POST"
                                      action="{{ route('admin.categories.update', $cat->id) }}"
                                      enctype="multipart/form-data">
                                    @csrf

                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label class="form-label">Category Name</label>
                                            <input type="text" name="name"
                                                   class="form-control"
                                                   value="{{ $cat->name }}" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Category Image</label>
                                            <input type="file" name="image" class="form-control">
                                        </div>

                                        @if($cat->image)
                                            <img src="{{ asset('uploads/categories/'.$cat->image) }}"
                                                 width="80" class="rounded">
                                        @endif
                                    </div>

                                    <div class="modal-footer">
                                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        <button class="btn btn-primary">Update Category</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

{{-- 🔍 SEARCH SCRIPT --}}
<script>
document.getElementById('categorySearch').addEventListener('keyup', function () {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('#categoryTable tbody tr');

    rows.forEach(row => {
        const categoryName = row.querySelector('.category-name')
                                 .innerText.toLowerCase();

        row.style.display = categoryName.includes(searchValue)
            ? ''
            : 'none';
    });
});
</script>

@endsection
