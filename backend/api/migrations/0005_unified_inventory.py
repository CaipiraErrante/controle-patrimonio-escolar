from decimal import Decimal

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


def ensure_inventory_schema(apps, schema_editor):
    model_names = ("Setor", "TipoBem", "Localizacao", "Bem", "Movimentacao")
    inventory_models = [apps.get_model("api", name) for name in model_names]
    expected_tables = {model._meta.db_table for model in inventory_models}
    existing_tables = set(schema_editor.connection.introspection.table_names())
    existing_inventory_tables = expected_tables & existing_tables

    if not existing_inventory_tables:
        for model in inventory_models:
            schema_editor.create_model(model)
        return

    if existing_inventory_tables != expected_tables:
        missing_tables = sorted(expected_tables - existing_inventory_tables)
        raise RuntimeError(
            "The unified inventory schema is only partially present. "
            f"Missing tables: {', '.join(missing_tables)}. "
            "Back up the database and repair the schema before retrying."
        )

    with schema_editor.connection.cursor() as cursor:
        for model in inventory_models:
            table = model._meta.db_table
            actual_columns = {
                column.name
                for column in schema_editor.connection.introspection.get_table_description(
                    cursor, table
                )
            }
            expected_columns = {
                field.column for field in model._meta.local_concrete_fields
            }
            if actual_columns != expected_columns:
                raise RuntimeError(
                    f"Table {table!r} does not match the unified inventory model. "
                    f"Expected columns {sorted(expected_columns)}, "
                    f"found {sorted(actual_columns)}. No schema changes were made."
                )

            constraints = schema_editor.connection.introspection.get_constraints(
                cursor, table
            )
            foreign_keys = {
                tuple(details["foreign_key"])
                for details in constraints.values()
                if details.get("foreign_key")
            }
            for field in model._meta.local_fields:
                if field.many_to_one and field.db_constraint:
                    expected_foreign_key = (
                        field.remote_field.model._meta.db_table,
                        field.target_field.column,
                    )
                    if expected_foreign_key not in foreign_keys:
                        raise RuntimeError(
                            f"Table {table!r} is missing the foreign key for "
                            f"column {field.column!r}. No schema changes were made."
                        )

            for constraint in model._meta.constraints:
                if constraint.name not in constraints:
                    raise RuntimeError(
                        f"Table {table!r} is missing constraint "
                        f"{constraint.name!r}. No schema changes were made."
                    )


class Migration(migrations.Migration):
    # MySQL implicitly commits DDL, so this schema reconciliation must run
    # outside Django's migration transaction.
    atomic = False

    dependencies = [
        ("api", "0004_restore_big_auto_fields"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.CreateModel(
                    name="Bem",
                    fields=[
                        ("id", models.AutoField(primary_key=True, serialize=False)),
                        (
                            "codigo_patrimonio",
                            models.CharField(max_length=50, unique=True),
                        ),
                        ("descricao", models.CharField(max_length=255)),
                        (
                            "estado_conservacao",
                            models.CharField(
                                choices=[
                                    ("Ótimo", "Ótimo"),
                                    ("Bom", "Bom"),
                                    ("Regular", "Regular"),
                                    ("Ruim", "Ruim"),
                                ],
                                max_length=7,
                            ),
                        ),
                        (
                            "situacao",
                            models.CharField(
                                choices=[("Ativo", "Ativo"), ("Baixado", "Baixado")],
                                max_length=7,
                            ),
                        ),
                        ("data_aquisicao", models.DateField(blank=True, null=True)),
                        (
                            "valor",
                            models.DecimalField(
                                blank=True,
                                decimal_places=2,
                                max_digits=12,
                                null=True,
                                validators=[
                                    django.core.validators.MinValueValidator(
                                        Decimal("0")
                                    )
                                ],
                            ),
                        ),
                    ],
                    options={
                        "db_table": "bem",
                        "ordering": ["codigo_patrimonio"],
                    },
                ),
                migrations.CreateModel(
                    name="Localizacao",
                    fields=[
                        ("id", models.AutoField(primary_key=True, serialize=False)),
                        ("nome", models.CharField(max_length=100)),
                        (
                            "descricao",
                            models.CharField(blank=True, max_length=255, null=True),
                        ),
                    ],
                    options={
                        "db_table": "localizacao",
                        "ordering": ["nome"],
                    },
                ),
                migrations.CreateModel(
                    name="Movimentacao",
                    fields=[
                        ("id", models.AutoField(primary_key=True, serialize=False)),
                        ("data_movimentacao", models.DateTimeField()),
                        (
                            "observacao",
                            models.CharField(blank=True, max_length=255, null=True),
                        ),
                        (
                            "bem",
                            models.ForeignKey(
                                db_column="bem_id",
                                on_delete=django.db.models.deletion.PROTECT,
                                to="api.bem",
                            ),
                        ),
                        (
                            "localizacao_destino",
                            models.ForeignKey(
                                db_column="localizacao_destino_id",
                                on_delete=django.db.models.deletion.PROTECT,
                                related_name="movimentacoes_destino",
                                to="api.localizacao",
                            ),
                        ),
                        (
                            "localizacao_origem",
                            models.ForeignKey(
                                db_column="localizacao_origem_id",
                                on_delete=django.db.models.deletion.PROTECT,
                                related_name="movimentacoes_origem",
                                to="api.localizacao",
                            ),
                        ),
                    ],
                    options={
                        "db_table": "movimentacao",
                        "ordering": ["-data_movimentacao"],
                    },
                ),
                migrations.CreateModel(
                    name="Setor",
                    fields=[
                        ("id", models.AutoField(primary_key=True, serialize=False)),
                        ("nome", models.CharField(max_length=100, unique=True)),
                        (
                            "descricao",
                            models.CharField(blank=True, max_length=255, null=True),
                        ),
                    ],
                    options={
                        "db_table": "setor",
                        "ordering": ["nome"],
                    },
                ),
                migrations.CreateModel(
                    name="TipoBem",
                    fields=[
                        ("id", models.AutoField(primary_key=True, serialize=False)),
                        ("nome", models.CharField(max_length=50, unique=True)),
                        (
                            "descricao",
                            models.CharField(blank=True, max_length=255, null=True),
                        ),
                    ],
                    options={
                        "db_table": "tipo_bem",
                        "ordering": ["nome"],
                    },
                ),
                migrations.DeleteModel(name="BensImateriais"),
                migrations.DeleteModel(name="BensImoveis"),
                migrations.DeleteModel(name="BensMoveis"),
                migrations.DeleteModel(name="BensSemoventes"),
                migrations.AddField(
                    model_name="movimentacao",
                    name="setor",
                    field=models.ForeignKey(
                        db_column="setor_id",
                        on_delete=django.db.models.deletion.PROTECT,
                        to="api.setor",
                    ),
                ),
                migrations.AddField(
                    model_name="bem",
                    name="setor",
                    field=models.ForeignKey(
                        db_column="setor_id",
                        on_delete=django.db.models.deletion.PROTECT,
                        to="api.setor",
                    ),
                ),
                migrations.AddField(
                    model_name="bem",
                    name="tipo_bem",
                    field=models.ForeignKey(
                        db_column="tipo_bem_id",
                        on_delete=django.db.models.deletion.PROTECT,
                        to="api.tipobem",
                    ),
                ),
                migrations.AddConstraint(
                    model_name="bem",
                    constraint=models.CheckConstraint(
                        condition=models.Q(valor__isnull=True) | models.Q(valor__gte=0),
                        name="bem_valor_nao_negativo",
                    ),
                ),
            ],
        ),
        migrations.RunPython(
            ensure_inventory_schema,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
