@extends('admin.layout')

@section('content')

    {{-- SUCCESS MESSAGE --}}
    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <h3 class="mb-4 d-flex justify-content-between align-items-center">
        Festival / Today's Special Banners

        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBannerModal">
            ➕ Add New Banner
        </button>
    </h3>

    {{-- ================= ADD BANNER MODAL ================= --}}
    <div class="modal fade" id="addBannerModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <form method="POST" action="{{ route('admin.festival_banners.store') }}" enctype="multipart/form-data">
                    @csrf

                    <div class="modal-header">
                        <h5 class="modal-title">Add Festival / Special Banner</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">

                        <div class="mb-3">
                            <label class="form-label">Festival Title</label>
                            <input type="text" name="title" class="form-control" placeholder="Ganesh Chaturthi Special"
                                required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Banner Image</label>
                            <input type="file" name="image" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Link to Food Item (Optional)</label>
                            <select name="food_item_id" class="form-select">
                                <option value="">-- No Link --</option>
                                @foreach($foodItems as $food)
                                    <option value="{{ $food->id }}">
                                        {{ $food->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>


                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>

                        <button type="submit" class="btn btn-primary">
                            Save Banner
                        </button>
                    </div>

                </form>

            </div>
        </div>
    </div>

    {{-- ================= BANNER LIST ================= --}}
    <div class="card">
        <div class="card-header">Existing Banners</div>
        <div class="card-body p-0">

            <table class="table table-bordered mb-0">
                <thead>
                    <tr>
                        <th>Sr.No.</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th width="25%">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    @foreach($banners as $b)
                        <tr>
                            <td>{{ $loop->iteration }}</td>

                            <td>
                                <img src="{{ asset('uploads/banners/' . $b->image) }}" width="120" class="rounded">
                            </td>

                            <td>{{ $b->title }}</td>

                            <td>
                                <span class="badge {{ $b->is_active ? 'bg-success' : 'bg-secondary' }}">
                                    {{ $b->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>

                            <td>
                                {{-- EDIT (MODAL) --}}
                                <button class="btn btn-sm btn-warning" data-bs-toggle="modal"
                                    data-bs-target="#editBanner{{ $b->id }}">
                                    Edit
                                </button>

                                {{-- TOGGLE --}}
                                <a href="{{ route('admin.festival_banners.toggle', $b->id) }}" class="btn btn-sm btn-info">
                                    {{ $b->is_active ? 'Deactivate' : 'Activate' }}
                                </a>

                                {{-- DELETE --}}
                                <form method="POST" action="{{ route('admin.festival_banners.destroy', $b->id) }}"
                                    style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-sm btn-danger" onclick="return confirm('Delete this banner?')">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>

                        {{-- ================= EDIT BANNER MODAL ================= --}}
                        <div class="modal fade" id="editBanner{{ $b->id }}" tabindex="-1">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">

                                    <form method="POST" action="{{ route('admin.festival_banners.update', $b->id) }}"
                                        enctype="multipart/form-data">
                                        @csrf
                                        @method('PUT')

                                        <div class="modal-header">
                                            <h5 class="modal-title">Edit Banner</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>

                                        <div class="modal-body">

                                            <div class="mb-3">
                                                <label class="form-label">Festival Title</label>
                                                <input type="text" name="title" class="form-control" value="{{ $b->title }}"
                                                    required>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">Change Image (optional)</label>
                                                <input type="file" name="image" class="form-control">
                                            </div>

                                        </div>

                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                                Cancel
                                            </button>

                                            <button type="submit" class="btn btn-primary">
                                                Update Banner
                                            </button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                        {{-- END EDIT MODAL --}}

                    @endforeach
                </tbody>
            </table>

        </div>
    </div>

@endsection